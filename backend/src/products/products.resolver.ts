import { Args, Int, ObjectType, Field, Query, Resolver } from '@nestjs/graphql';
import { Product } from './product.schema';
import { ProductsService } from './products.service';

@ObjectType()
class ProductPage {
  @Field(() => [Product])
  items: Product[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductPage)
  async getProducts(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 12 }) limit: number,
    @Args('search', { nullable: true }) search?: string
  ) {
    return this.productsService.getProducts(page, limit, search || '');
  }
}
