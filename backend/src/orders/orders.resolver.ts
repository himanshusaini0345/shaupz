import { Args, Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.schema';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => Order, { nullable: true })
  async getOrderById(@Args('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Query(() => [Order])
  async getUserOrders(@Args('sessionId') sessionId: string) {
    return this.ordersService.getUserOrders(sessionId);
  }
}
