import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ColumnNumericTransformer } from '../../common/transformers/decimal.transformer';
import { ProductReview } from './product-review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  image?: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: ColumnNumericTransformer,
  })
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: ColumnNumericTransformer,
  })
  oldPrice?: number;

  @Column('int', { default: 50 })
  stock: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column('decimal', {
    name: 'rating_avg',
    precision: 3,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  ratingAvg: number;

  @Column('int', { name: 'rating_count', default: 0 })
  ratingCount: number;

  @OneToMany(() => ProductReview, (r) => r.product)
  reviews: ProductReview[];
}