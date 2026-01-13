import { Controller, Post, Body, Param, ParseIntPipe, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List orders (Admin only)' })
  async list(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.ordersService.list(page ?? 1, perPage ?? 10);
  }

  @Public()
  @Get(':id/wa-link')
  @ApiOperation({ summary: 'Generate WhatsApp link' })
  async getWhatsappLink(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.generateWhatsappLink(id);
  }

  @Public()
  @Post(':id/verify-email')
  @ApiOperation({ summary: 'Mark order email as verified' })
  async verifyEmail(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.verifyEmail(id);
  }

  @Public()
  @Post(':id/confirm-via-whatsapp')
  @ApiOperation({ summary: 'Confirm order via WhatsApp' })
  async confirmViaWhatsapp(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.confirmViaWhatsapp(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order (Admin only)' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancel(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete order (Admin only)' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.softDelete(id);
  }

  // Get orders by user email
  @Public()
  @Get('user/:email')
  @ApiOperation({ summary: 'Get orders by user email' })
  async getUserOrders(@Param('email') email: string) {
    const orders = await this.ordersService.findByEmail(email);
    return { ok: true, orders };
  }
}
