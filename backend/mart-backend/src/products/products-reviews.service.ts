import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from './entities/product-review.entity';
import { Product } from './entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepo: Repository<ProductReview>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(productId: number, userId: number | null, dto: CreateReviewDto) {
    // Defensive: ensure integer rating even if DTO passed something odd
    const rating = Math.floor(Number(dto.rating));
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('rating must be an integer between 1 and 5');
    }

    const product = await this.productRepo.findOne({ where: { id: productId, isDeleted: false } });
    if (!product) throw new NotFoundException('Product not found');

    // optional: prevent duplicate reviews by same user
    if (userId) {
      const exists = await this.reviewRepo.findOne({
        where: { product: { id: productId }, user: { id: userId }, isDeleted: false },
      });
      if (exists) throw new BadRequestException('You already reviewed this product');
    }

    const review = this.reviewRepo.create({
      product,
      user: userId ? ({ id: userId } as any) : null,
      rating,
      comment: dto.comment,
    });

    await this.reviewRepo.manager.transaction(async (em) => {
      await em.getRepository(ProductReview).save(review);

      // Use repository QB so TypeORM maps property -> DB column names
      const raw = await em
        .getRepository(ProductReview)
        .createQueryBuilder('r')
        .select('COALESCE(SUM(r.rating),0)', 'sum')
        .addSelect('COUNT(r.id)', 'count')
        .where('r.product = :pid AND r.isDeleted = false', { pid: productId })
        .getRawOne();

      const sum = Number(raw.sum ?? 0);
      const count = Number(raw.count ?? 0);
      const avg = count ? Number((sum / count).toFixed(2)) : 0;

      await em.getRepository(Product).update({ id: productId }, { ratingAvg: avg, ratingCount: count });
    });

    return review;
  }

  async list(productId: number, page = 1, perPage = 10) {
    const [data, total] = await this.reviewRepo.findAndCount({
      where: { product: { id: productId }, isDeleted: false },
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return { data, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async remove(reviewId: number, userId?: number) {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId }, relations: ['product', 'user'] });
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');
    if (userId && review.user && review.user.id !== userId) throw new BadRequestException('Not your review');

    await this.reviewRepo.manager.transaction(async (em) => {
      await em.getRepository(ProductReview).update({ id: reviewId }, { isDeleted: true });

      const pid = review.product.id;
      const raw = await em
        .getRepository(ProductReview)
        .createQueryBuilder('r')
        .select('COALESCE(SUM(r.rating),0)', 'sum')
        .addSelect('COUNT(r.id)', 'count')
        .where('r.product = :pid AND r.isDeleted = false', { pid })
        .getRawOne();

      const sum = Number(raw.sum ?? 0);
      const count = Number(raw.count ?? 0);
      const avg = count ? Number((sum / count).toFixed(2)) : 0;
      await em.getRepository(Product).update({ id: pid }, { ratingAvg: avg, ratingCount: count });
    });

    return { ok: true };
  }
}
