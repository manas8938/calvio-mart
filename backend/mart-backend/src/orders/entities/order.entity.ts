import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../common/transformers/decimal.transformer';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  WHATSAPP_CONFIRMED = 'WHATSAPP_CONFIRMED',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
@Index(['email'])
@Index(['status'])
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column()
  email: string;

  @Column({ nullable: true })
  whatsappNumber?: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: ColumnNumericTransformer,
    default: 0,
  })
  subtotal: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 150,
    transformer: ColumnNumericTransformer,
  })
  deliveryCharge: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: ColumnNumericTransformer,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
