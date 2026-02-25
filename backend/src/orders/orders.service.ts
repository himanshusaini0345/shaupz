import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async getOrderById(id: string) {
    return this.orderModel.findById(id);
  }

  async getUserOrders(sessionId: string) {
    return this.orderModel.find({ sessionId }).sort({ createdAt: -1 });
  }
}
