// src/users/users.service.ts - COMPLETELY FIXED
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    
    const normalized = this.normalizeEmail(email);
    
    try {
      const user = await this.usersRepo.findOne({
        where: { email: normalized, isDeleted: false },
      });
      
      if (user) {
        this.logger.log(`User found: ${user.email}, role: ${user.role}, hasPassword: ${!!user.password}`);
      } else {
        this.logger.log(`User not found: ${normalized}`);
      }
      
      return user ?? null;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      return null;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const user = await this.usersRepo.findOne({ 
        where: { id, isDeleted: false } 
      });
      return user ?? null;
    } catch (error) {
      this.logger.error(`Error finding user by id: ${error.message}`);
      return null;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      // Normalize email
      if (userData.email) {
        userData.email = this.normalizeEmail(userData.email);
      }

      // Ensure isDeleted is false
      userData.isDeleted = false;

      // Hash password if provided and not already hashed
      if (userData.password && !userData.password.startsWith('$2b$')) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
        this.logger.log(`Password hashed for user: ${userData.email}`);
      }

      const user = this.usersRepo.create(userData);
      const savedUser = await this.usersRepo.save(user);
      
      this.logger.log(`User created: ${savedUser.email}, role: ${savedUser.role}`);
      
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async updateWhatsapp(email: string, whatsappNumber: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    
    user.whatsappNumber = whatsappNumber;
    return this.usersRepo.save(user);
  }

  async markEmailVerified(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    
    user.isEmailVerified = true;
    await this.usersRepo.save(user);
    
    this.logger.log(`Email verified for user: ${email}`);
  }

  async deleteSoft(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    
    user.isDeleted = true;
    await this.usersRepo.save(user);
    
    this.logger.log(`User soft deleted: ${email}`);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await this.usersRepo.save(user);
    
    this.logger.log(`Password updated for user: ${email}`);
  }
} 