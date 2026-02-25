import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

/**
 * 订单项实体
 */
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid' })
  product_id: string; // 商品 ID

  @Column({ type: 'uuid' })
  sku_id: string; // SKU ID

  @Column({ type: 'varchar', length: 200 })
  product_name: string; // 商品名称

  @Column({ type: 'varchar', length: 500 })
  product_image: string; // 商品图片

  @Column({ type: 'varchar', length: 100 })
  sku_name: string; // SKU 名称

  @Column({ type: 'varchar', length: 500, nullable: true })
  sku_specs: string; // SKU 规格（JSON）

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // 单价

  @Column({ type: 'int' })
  quantity: number; // 数量

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number; // 小计

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
