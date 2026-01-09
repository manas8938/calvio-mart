import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'anakxofficial@gmail.com',
    description: 'User email (will be normalized to lowercase)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Anas Nawaz',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: '+923029125349',
    required: false,
  })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;
}
