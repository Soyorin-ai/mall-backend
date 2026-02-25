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
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 0, // 待支付
  PAID = 1, // 已支付
  SHIPPED = 2, // 已发货
  COMPLETED = 3, // 已完成
  CANCELLED = 4, // 已取消
  REFUNDING = 5, // 退款中
  REFUNDED = 6, // 已退款
}

/**
 * 订单实体
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  order_no: string; // 订单号

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: OrderStatus.PENDING })
  status: number; // 订单状态

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number; // 商品总金额

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  freight_amount: number; // 运费

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number; // 优惠金额

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pay_amount: number; // 实付金额

  @Column({ type: 'uuid', nullable: true })
  coupon_id: string; // 优惠券 ID

  @Column({ type: 'varchar', length: 50 })
  receiver_name: string; // 收货人

  @Column({ type: 'varchar', length: 20 })
  receiver_phone: string; // 收货人手机

  @Column({ type: 'varchar', length: 50 })
  receiver_province: string; // 省

  @Column({ type: 'varchar', length: 50 })
  receiver_city: string; // 市

  @Column({ type: 'varchar', length: 50 })
  receiver_district: string; // 区

  @Column({ type: 'varchar', length: 200 })
  receiver_address: string; // 详细地址

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string; // 订单备注

  @Column({ type: 'varchar', length: 100, nullable: true })
  express_company: string; // 快递公司

  @Column({ type: 'varchar', length: 100, nullable: true })
  express_no: string; // 快递单号

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date; // 支付时间

  @Column({ type: 'timestamp', nullable: true })
  shipped_at: Date; // 发货时间

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date; // 完成时间

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date; // 取消时间

  @Column({ type: 'varchar', length: 500, nullable: true })
  cancel_reason: string; // 取消原因

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // 关联
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
