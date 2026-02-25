import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@ObjectType()
@Schema({ timestamps: true })
export class OrderItem {
  @Field(() => ID)
  @Prop({ required: true })
  productId: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  quantity: number;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  sessionId: string;

  @Field(() => [OrderItem])
  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Field(() => Float)
  @Prop({ required: true })
  totalAmount: number;

  @Field()
  @Prop({ default: 'PENDING' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
