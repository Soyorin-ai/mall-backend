import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 用户收藏实体
 */
@Entity('user_favorites')
@Index(['user_id', 'product_id'], { unique: true })
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  product_id: string; // 商品 ID

  @Column({ type: 'varchar', length: 200 })
  product_name: string; // 商品名称（冗余，方便查询）

  @Column({ type: 'varchar', length: 500 })
  product_image: string; // 商品图片（冗余）

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  product_price: number; // 商品价格（冗余）

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
