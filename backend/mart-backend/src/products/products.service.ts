import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  async list(query: ListProductsDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 12;
    const skip = (page - 1) * perPage;

    let order: Record<string, 'ASC' | 'DESC'> = { id: 'DESC' };

    if (query.sort) {
      const [fieldRaw, dirRaw] = query.sort.split(':').map(s => s.trim());
      const dir = dirRaw?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      const allowed: Record<string, string> = {
        price: 'price',
        rating: 'ratingAvg',
        stock: 'stock',
        title: 'title',
        id: 'id',
      };
      const column = allowed[fieldRaw];
      if (column) order = { [column]: dir as 'ASC' | 'DESC' };
    }

    const [items, total] = await this.productsRepo.findAndCount({
      where: { isDeleted: false },
      order,
      skip,
      take: perPage,
    });

    return {
      items,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async search(search: string, page = 1, perPage = 12) {
    const skip = (page - 1) * perPage;

    const [items, total] = await this.productsRepo.findAndCount({
      where: [
        { title: ILike(`%${search}%`), isDeleted: false },
        { category: ILike(`%${search}%`), isDeleted: false },
      ],
      skip,
      take: perPage,
      order: { id: 'DESC' },
    });

    return {
      items,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ 
      where: { id, isDeleted: false } 
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto, imageUrl?: string) {
    console.log('📦 Creating product:', { dto, imageUrl });
    
    const product = this.productsRepo.create({
      title: dto.title,
      category: dto.category ?? null,
      image: imageUrl ?? null,
      price: dto.price,
      oldPrice: dto.oldPrice ?? null,
      stock: dto.stock ?? 50,
      isDeleted: false,
      ratingAvg: 0,
      ratingCount: 0,
    });

    const saved = await this.productsRepo.save(product);
    console.log('✅ Product created successfully:', saved);
    
    return saved;
  }

  async update(id: number, dto: UpdateProductDto, imageUrl?: string) {
    const product = await this.findOne(id);

    if (dto.title !== undefined) product.title = dto.title;
    if (dto.category !== undefined) product.category = dto.category;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.oldPrice !== undefined) product.oldPrice = dto.oldPrice;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.isDeleted !== undefined) product.isDeleted = dto.isDeleted;
    if (imageUrl !== undefined) product.image = imageUrl;

    const updated = await this.productsRepo.save(product);
    console.log('✅ Product updated successfully:', updated);
    
    return updated;
  }

  async softDelete(id: number) {
    const product = await this.findOne(id);
    product.isDeleted = true;
    await this.productsRepo.save(product);
    console.log('🗑️  Product soft-deleted:', id);
  }
}
