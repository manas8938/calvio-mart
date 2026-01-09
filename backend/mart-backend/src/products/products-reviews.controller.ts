import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductReviewsService } from './products-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-reviews')
@Controller('products/:productId/reviews')
export class ProductReviewsController {
  constructor(private readonly svc: ProductReviewsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.svc.create(productId, null, dto);
  }

  @Get()
  async list(@Param('productId', ParseIntPipe) productId: number, @Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.svc.list(productId, Number(page) || 1, Number(perPage) || 10);
  }

  @Delete(':id')
  async remove(@Param('productId', ParseIntPipe) productId: number, @Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
