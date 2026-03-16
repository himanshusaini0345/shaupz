import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    private readonly redisService: RedisService
  ) {}

  async getProducts(page = 1, limit = 12, search = '') {
    const cacheKey = `products:${page}:${limit}:${search}`;
    const cached = await this.redisService.get<{ items: Product[]; total: number; page: number; limit: number }>(cacheKey);
    if (cached) return cached;

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const [items, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit),
      this.productModel.countDocuments(query),
    ]);

    const response = {
      items,
      total,
      page,
      limit,
    };
    await this.redisService.set(cacheKey, response, 120);
    return response;
  }

  async findByIds(ids: string[]) {
    return this.productModel.find({ _id: { $in: ids } });
  }

  async updateProduct(id: string, payload: Partial<Product>) {
    const updated = await this.productModel.findByIdAndUpdate(id, payload, { new: true });
    await this.invalidateCache();
    return updated;
  }

  async deleteProduct(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id);
    await this.invalidateCache();
    return deleted;
  }


  async invalidateCache() {
    const keys = await this.redisService.client.keys('products:*');
    if (keys.length) await this.redisService.client.del(...keys);
  }
}
