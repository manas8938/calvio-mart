import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Patch,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { Product } from './entities/product.entity';
import { multerConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  // This is Public Endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with optional search & pagination' })
  @ApiResponse({ status: 200, description: 'Paginated products list' })
  async list(@Query(new ValidationPipe({ transform: true })) query: ListProductsDto) {
    if (query.search) return this.productsService.search(query.search, query.page, query.perPage);
    return this.productsService.list(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
  
  // Admin Endpoints (TEMPORARILY PUBLIC FOR TESTING)
  @Public() 
  
  @Post()
  @ApiOperation({ summary: 'Create product (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        category: { type: 'string' },
        price: { type: 'number' },
        oldPrice: { type: 'number' },
        stock: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }

    // /uploads folder
    const imageUrl = `/uploads/${file.filename}`;
    
    console.log('📸 Image uploaded:', {
      filename: file.filename,
      path: file.path,
      imageUrl,
    });

    return this.productsService.create(dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update product (Admin only, partial)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
  ) {
    let imageUrl: string | undefined;
    
    if (file) {
      imageUrl = `/uploads/${file.filename}`;
      console.log('📸 Image updated:', {
        filename: file.filename,
        imageUrl,
      });
    }

    return this.productsService.update(id, dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product soft-deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.softDelete(id);
    return { ok: true, message: 'Product soft-deleted' };
  }
}
