import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

// DTOs
export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;

  @IsOptional()
  @IsInt()
  orderId?: number;
}

export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}

// OTP Storage 
type OtpRecord = { secret: string; stepSeconds: number; expiresAt: number };
const otpStore = new Map<string, OtpRecord>();

type AttemptRecord = { count: number; resetAt: number };
const sendAttempts = new Map<string, AttemptRecord>();
const verifyAttempts = new Map<string, AttemptRecord>();

const SEND_ATTEMPT_LIMIT = Number(process.env.OTP_SEND_LIMIT) || 10;
const VERIFY_ATTEMPT_LIMIT = Number(process.env.OTP_VERIFY_LIMIT) || 5;
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}

  //Admin Signup: POST /auth/admin/signup 
  @Public()
  @Post('admin/signup')
  @ApiOperation({ summary: 'Admin signup' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminSignup(@Body() body: AdminSignupDto) {
    const { email, password, fullName } = body;
    const normalizedEmail = email.trim().toLowerCase();

    this.logger.log(`Admin signup attempt for: ${normalizedEmail}`);

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    
    if (existingUser) {
      // If user exists but has no password (OTP-only user), update them to admin
      if (!existingUser.password) {
        this.logger.log(`Converting OTP user to admin: ${normalizedEmail}`);
        await this.usersService.updatePassword(normalizedEmail, password);
        
        // Update to admin role
        existingUser.role = UserRole.ADMIN;
        existingUser.fullName = fullName;
        existingUser.isEmailVerified = true;
        
        return {
          ok: true,
          message: 'Admin account created successfully. Please login.',
          email: existingUser.email,
        };
      } else {
        throw new ConflictException('Email already registered. Please login.');
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email: normalizedEmail,
      password: hashedPassword,
      fullName,
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });

    this.logger.log(`Admin account created: ${normalizedEmail}`);

    return {
      ok: true,
      message: 'Admin account created successfully. Please login.',
      email: user.email,
    };
  }

  @Public()
  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminLogin(@Body() body: AdminLoginDto) {
    const normalizedEmail = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    this.logger.log(`Admin login attempt: ${normalizedEmail}`);

    if (!normalizedEmail || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user
    const user = await this.usersService.findByEmail(normalizedEmail);
    
    if (!user) {
      this.logger.warn(`User not found: ${normalizedEmail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has password
    if (!user.password) {
      this.logger.warn(`User has no password: ${normalizedEmail}`);
      throw new UnauthorizedException('Please complete signup first');
    }

    // Check role
    if (user.role !== UserRole.ADMIN) {
      this.logger.warn(`Not admin: ${normalizedEmail}, role: ${user.role}`);
      throw new UnauthorizedException('Access denied. Admin only.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      this.logger.warn(`Invalid password: ${normalizedEmail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Admin login successful: ${normalizedEmail}`);

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      role: user.role, 
      email: user.email 
    };
    const token = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password: _pw, ...userSafe } = user as any;

    return { 
      ok: true,
      token, 
      user: userSafe 
    };
  }

  @Public()
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to user email' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendOtp(@Body() body: SendOtpDto) {
    const email = body?.email?.trim()?.toLowerCase();
    if (!email) throw new BadRequestException('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const now = Date.now();
    const send = sendAttempts.get(email) ?? { count: 0, resetAt: now + ATTEMPT_WINDOW_MS };

    if (now > send.resetAt) {
      send.count = 0;
      send.resetAt = now + ATTEMPT_WINDOW_MS;
    }

    if (send.count >= SEND_ATTEMPT_LIMIT) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    send.count++;
    sendAttempts.set(email, send);

    const expiryMinutes = Number(process.env.OTP_EXPIRE_MINUTES) || 5;
    const stepSeconds = Math.max(30, expiryMinutes * 60);

    const secret = this.otpService.createSecret();
    const otp = this.otpService.generateOtpFromSecret(secret, stepSeconds);
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

    otpStore.set(email, { secret, stepSeconds, expiresAt });

    setTimeout(() => {
      const item = otpStore.get(email);
      if (item && item.expiresAt <= Date.now()) otpStore.delete(email);
    }, expiryMinutes * 60 * 1000 + 1000);

    // Always log OTP in development
    this.logger.log(`OTP for ${email}: ${otp}`);

    if (process.env.NODE_ENV === 'production') {
      await this.emailService.sendOTP(email, otp);
    }

    return {
      ok: true,
      message: 'OTP sent to your email',
      expiresIn: expiryMinutes * 60,
    };
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const email = body?.email?.trim()?.toLowerCase();
    const otp = body?.otp?.trim();
    const orderId = body?.orderId;

    if (!email || !otp) throw new BadRequestException('Email and OTP required');

    const now = Date.now();
    const v = verifyAttempts.get(email) ?? { count: 0, resetAt: now + ATTEMPT_WINDOW_MS };

    if (now > v.resetAt) {
      v.count = 0;
      v.resetAt = now + ATTEMPT_WINDOW_MS;
    }

    if (v.count >= VERIFY_ATTEMPT_LIMIT) {
      throw new BadRequestException('Too many verification attempts. Try later.');
    }

    const data = otpStore.get(email);
    if (!data) {
      v.count++;
      verifyAttempts.set(email, v);
      throw new BadRequestException('OTP expired or not found');
    }

    if (Date.now() > data.expiresAt) {
      otpStore.delete(email);
      v.count++;
      verifyAttempts.set(email, v);
      throw new BadRequestException('OTP has expired');
    }

    const valid = this.otpService.verifyOtp(data.secret, otp, 0, data.stepSeconds);
    if (!valid) {
      v.count++;
      verifyAttempts.set(email, v);
      throw new BadRequestException('Invalid OTP');
    }

    otpStore.delete(email);
    verifyAttempts.delete(email);

    // Create or update user
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        role: UserRole.USER,
        isEmailVerified: true,
      });
    } else {
      await this.usersService.markEmailVerified(email);
    }

    if (orderId) {
      try {
        await this.ordersService.verifyEmail(orderId);
      } catch (err) {
        this.logger.warn(`Failed to mark order ${orderId} as verified`);
      }
    }

    // Generate JWT token
    const payload = { sub: user.id, role: user.role, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      ok: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      orderId: orderId ?? null,
    };
  }
}
