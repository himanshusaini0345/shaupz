import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from "src/products/products.module";
import { CartResolver } from "./cart.resolver";

@Module({
  imports: [ProductsModule],
  providers: [CartResolver, CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
