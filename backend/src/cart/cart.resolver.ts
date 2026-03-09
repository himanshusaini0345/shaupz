import {
  Context,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { CartService, CartItem } from "./cart.service";
import { ProductsService } from "../products/products.service";
import { Product } from "src/products/product.schema";

@ObjectType()
export class CartItemView {
  @Field(() => Product)
  product: Product;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
class Cart {
  @Field(() => [CartItemView])
  items: CartItemView[];

}

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => Cart)
  async getCart(@Context() ctx) {
    let cart = await this.cartService.getCart(ctx.sessionId || "guest-session");

    const products = await this.productsService.findByIds(
      cart.map((i) => i.productId),
    );

    return {
      items: cart.map((item) => ({
        quantity: item.quantity,
        product: products.find((p) => p.id === item.productId),
      })),
    };
  }
}
