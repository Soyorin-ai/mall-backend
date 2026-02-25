import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/category.entity';
import { ProductSku } from './entities/sku.entity';
import { ProductService } from './product.service';
import { ProductController, AdminProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, ProductSku])],
  controllers: [ProductController, AdminProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
