// src/orders/dto/create-order.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: '+923001234567' })
  @IsNotEmpty()
  @Matches(/^\+?[\d]{10,15}$/, {
    message: 'Phone number must be 10-15 digits, optionally starting with +'
  })
  whatsappNumber: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ example: '123 Main Street, City' })
  @IsOptional()
  @IsString()
  address?: string;
}


