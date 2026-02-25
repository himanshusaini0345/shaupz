import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Product, ProductDocument } from '../products/product.schema';
import { Order, OrderDocument } from '../orders/order.schema';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly cartService: CartService
  ) {}

  async checkout(sessionId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const cart = await this.cartService.getCart(sessionId);
      if (!cart.length) throw new BadRequestException('Cart is empty');

      const ids = cart.map((item) => item.productId);
      const products = await this.productModel.find({ _id: { $in: ids } }).session(session);

      let totalAmount = 0;
      const items = cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new BadRequestException(`Product ${item.productId} missing`);
        if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        return { productId: product.id, name: product.name, quantity: item.quantity, price: product.price };
      });

      await Promise.all(products.map((product) => product.save({ session })));

      const [order] = await this.orderModel.create(
        [
          {
            sessionId,
            items,
            totalAmount,
            status: 'CREATED'
          }
        ],
        { session }
      );

      await session.commitTransaction();
      await this.cartService.clearCart(sessionId);
      return { orderId: order.id, totalAmount };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
