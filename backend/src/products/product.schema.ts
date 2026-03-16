import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => ID)
  id: string;
  
  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field(() => Int)
  @Prop({ required: true })
  stock: number;

  @Field()
  @Prop({ required: true })
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", {
  virtuals: true,
});