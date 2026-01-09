// src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  private readonly DELIVERY_CHARGE = 150;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto) {
    if (!dto.email || !dto.whatsappNumber) {
      throw new BadRequestException('Email and WhatsApp number are required');
    }

    const itemsDto = dto.items ?? [];
    if (!Array.isArray(itemsDto) || itemsDto.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const productIds = Array.from(new Set(itemsDto.map((i) => i.productId)));
    const products = await this.productRepo.findBy({ id: In(productIds as number[]) });

    const productMap = new Map<number, Product>();
    products.forEach((p) => productMap.set(p.id, p));

    const itemsEntities: OrderItem[] = [];
    let subtotal = 0;

    for (const it of itemsDto) {
      const product = productMap.get(it.productId);
      if (!product || product.isDeleted) {
        throw new BadRequestException(`Product ${it.productId} not found`);
      }

      const qty = Math.max(1, Math.floor(Number(it.quantity) || 0));
      if (qty <= 0) {
        throw new BadRequestException(`Invalid quantity for product ${it.productId}`);
      }

      if (product.stock < qty) {
        throw new BadRequestException(
          `Product "${product.title}" has insufficient stock. Available: ${product.stock}, Requested: ${qty}`
        );
      }

      const price = Number(product.price);
      subtotal += price * qty;

      const orderItem = this.orderItemRepo.create({
        product,
        quantity: qty,
        price,
        title: product.title,
        image: (product as any).image ?? null,
      });
      itemsEntities.push(orderItem);
    }

    const deliveryCharge = this.DELIVERY_CHARGE;
    const totalAmount = Number((subtotal + deliveryCharge).toFixed(2));

    const saved = await this.orderRepo.manager.transaction(async (manager) => {
      // decrement stock within transaction
      for (const item of itemsEntities) {
        await manager.decrement(Product, { id: item.product.id }, 'stock', item.quantity);
      }

      const order = manager.create(Order, {
        email: dto.email,
        whatsappNumber: dto.whatsappNumber,
        address: dto.address ?? null,
        items: itemsEntities,
        subtotal,
        deliveryCharge,
        totalAmount,
        status: OrderStatus.PENDING,
      });

      const res = await manager.save(order);

      return manager.findOne(Order, {
        where: { id: (res as Order).id },
        relations: ['items', 'items.product'],
      });
    });

    return saved;
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async list(page = 1, perPage = 10) {
    const [data, total] = await this.orderRepo.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.product'],
    });

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async verifyEmail(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PENDING) {
      return { ok: true, message: 'Order already verified or progressed', orderId: order.id };
    }

    order.status = OrderStatus.EMAIL_VERIFIED;
    await this.orderRepo.save(order);
    return { ok: true, orderId: order.id };
  }

  async generateWhatsappLink(id: number) {
    const order = await this.findOne(id);

    const titles = (order.items || [])
      .map((it: OrderItem) => it.title ?? it.product?.title ?? `Product#${it.product?.id ?? 'N/A'}`)
      .join(', ');

    const message = `I confirm my order #${order.id}. Items: ${titles}. Total: PKR ${order.totalAmount}.`;
    const clean = (order.whatsappNumber || '').replace(/\D/g, '');
    if (!clean) throw new BadRequestException('Invalid WhatsApp number');

    const waLink = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
    return { waLink, message };
  }

  async confirmViaWhatsapp(id: number) {
    const order = await this.findOne(id);
    if (order.status === OrderStatus.PENDING) {
      throw new BadRequestException('Email not verified for this order');
    }
    order.status = OrderStatus.WHATSAPP_CONFIRMED;
    await this.orderRepo.save(order);
    return { ok: true, orderId: order.id };
  }

  async cancel(id: number) {
    const order = await this.findOne(id);
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel delivered or already cancelled order');
    }
    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);
    return { ok: true };
  }

  async softDelete(id: number) {
    const order = await this.findOne(id);
    order.isDeleted = true;
    await this.orderRepo.save(order);
    return { ok: true, message: 'Order soft-deleted' };
  }

  // ==============================
  // New: Find orders by user email
  // ==============================
  async findByEmail(email: string) {
    const orders = await this.orderRepo.find({
      where: { email, isDeleted: false },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
    return orders;
  }
}
