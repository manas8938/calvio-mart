import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Organic Honey', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Groceries', description: 'Product category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'Product image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 1299.99, description: 'Current selling price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 1499.99, description: 'Old price (optional)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @ApiPropertyOptional({ example: 50, description: 'Stock count' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 4.8, description: 'Rating' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  rating?: number;

}