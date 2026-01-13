import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  @ApiOperation({ summary: 'Get a user by email (ignores soft-deleted users)' })
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (guest or registered)' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidUnknownValues: true }))
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body as Partial<User>);
  }
}


