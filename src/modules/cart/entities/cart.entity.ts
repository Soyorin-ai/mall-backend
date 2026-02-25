import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { ProductSku } from '../../product/entities/sku.entity';

/**
 * 购物车实体
 */
@Entity('carts')
@Index(['user_id', 'sku_id'], { unique: true })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid' })
  sku_id: string;

  @ManyToOne(() => ProductSku)
  @JoinColumn({ name: 'sku_id' })
  sku: ProductSku;

  @Column({ type: 'int' })
  quantity: number; // 数量

  @Column({ type: 'boolean', default: true })
  is_selected: boolean; // 是否选中

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
