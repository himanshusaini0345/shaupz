import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetProductsInput {
  @Field(() => Int, { defaultValue: 1 })
  page = 1;

  @Field(() => Int, { defaultValue: 12 })
  limit = 12;

  @Field({ nullable: true })
  search?: string;
}
