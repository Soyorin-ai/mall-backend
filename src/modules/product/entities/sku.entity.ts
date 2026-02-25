import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

/**
 * 商品 SKU 实体
 */
@Entity('product_skus')
export class ProductSku {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  product_id: string; // 商品 ID

  @ManyToOne(() => Product, (product) => product.skus)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 100 })
  sku_name: string; // SKU 名称

  @Column({ type: 'varchar', length: 500 })
  sku_image: string; // SKU 图片

  @Column({ type: 'varchar', length: 500, nullable: true })
  specs: string; // 规格值（JSON）

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // 销售价

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  original_price: number; // 原价

  @Column({ type: 'int', default: 0 })
  stock: number; // 库存

  @Column({ type: 'int', default: 0 })
  sales: number; // 销量

  @Column({ type: 'varchar', length: 100, unique: true })
  sku_code: string; // SKU 编码

  @Column({ type: 'int', default: 1 })
  status: number; // 状态 0-禁用 1-启用

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
