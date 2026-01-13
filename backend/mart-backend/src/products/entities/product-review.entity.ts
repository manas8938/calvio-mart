import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('product_reviews')
@Index(['product', 'user'], { unique: true })
export class ProductReview {
  @PrimaryGeneratedColumn({ name: 'product_review_id' })
  id: number;

  @ManyToOne(() => Product, (p) => p.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column('int', { name: 'rating' })
  rating: number;

  @Column({ type: 'text', name: 'comment', nullable: true })
  comment?: string;
  
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
