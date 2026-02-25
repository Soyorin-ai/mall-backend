import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 用户地址实体
 */
@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  receiver: string; // 收货人

  @Column({ type: 'varchar', length: 20 })
  phone: string; // 手机号

  @Column({ type: 'varchar', length: 50 })
  province: string; // 省

  @Column({ type: 'varchar', length: 50 })
  city: string; // 市

  @Column({ type: 'varchar', length: 50 })
  district: string; // 区

  @Column({ type: 'varchar', length: 200 })
  detail: string; // 详细地址

  @Column({ type: 'boolean', default: false })
  is_default: boolean; // 是否默认地址

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
