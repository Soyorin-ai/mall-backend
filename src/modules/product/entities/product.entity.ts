import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductCategory } from './category.entity';
import { ProductSku } from './sku.entity';

/**
 * 商品 SPU 实体
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  category_id: string; // 分类 ID

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @Column({ type: 'varchar', length: 200 })
  name: string; // 商品名称

  @Column({ type: 'varchar', length: 500 })
  main_image: string; // 主图

  @Column({ type: 'text', nullable: true })
  images: string; // 商品图片（JSON 数组）

  @Column({ type: 'text', nullable: true })
  description: string; // 商品描述

  @Column({ type: 'text', nullable: true })
  detail: string; // 商品详情（富文本）

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // 销售价

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  original_price: number; // 原价

  @Column({ type: 'int', default: 0 })
  stock: number; // 总库存

  @Column({ type: 'int', default: 0 })
  sales: number; // 销量

  @Column({ type: 'int', default: 0 })
  virtual_sales: number; // 虚拟销量

  @Column({ type: 'int', default: 0 })
  status: number; // 状态 0-下架 1-上架 2-草稿

  @Column({ type: 'int', default: 0 })
  sort: number; // 排序

  @Column({ type: 'boolean', default: false })
  is_hot: boolean; // 是否热销

  @Column({ type: 'boolean', default: false })
  is_new: boolean; // 是否新品

  @Column({ type: 'boolean', default: false })
  is_recommend: boolean; // 是否推荐

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // 关联
  @OneToMany(() => ProductSku, (sku) => sku.product)
  skus: ProductSku[];
}
