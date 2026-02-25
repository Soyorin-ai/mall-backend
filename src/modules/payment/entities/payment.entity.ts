import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  PENDING = 0, // 待支付
  SUCCESS = 1, // 支付成功
  FAILED = 2, // 支付失败
  REFUNDED = 3, // 已退款
}

/**
 * 支付方式枚举
 */
export enum PaymentMethod {
  WECHAT_MINI = 1, // 微信小程序支付
  WECHAT_H5 = 2, // 微信 H5 支付
  WECHAT_NATIVE = 3, // 微信扫码支付
}

/**
 * 支付记录实体
 */
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  payment_no: string; // 支付单号

  @Column({ type: 'uuid' })
  order_id: string; // 订单 ID

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 32 })
  order_no: string; // 订单号

  @Column({ type: 'uuid' })
  user_id: string; // 用户 ID

  @Column({ type: 'int' })
  payment_method: number; // 支付方式

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // 支付金额

  @Column({ type: 'int', default: PaymentStatus.PENDING })
  status: number; // 支付状态

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_id: string; // 微信支付交易号

  @Column({ type: 'varchar', length: 100, nullable: true })
  prepay_id: string; // 预支付交易会话标识

  @Column({ type: 'varchar', length: 500, nullable: true })
  qr_code: string; // 支付二维码（扫码支付）

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date; // 支付时间

  @Column({ type: 'timestamp', nullable: true })
  expired_at: Date; // 过期时间

  @Column({ type: 'text', nullable: true })
  notify_data: string; // 支付回调数据

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
