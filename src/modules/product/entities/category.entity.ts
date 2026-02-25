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

/**
 * 商品分类实体
 */
@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // 分类名称

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string; // 分类图标

  @Column({ type: 'int', default: 0 })
  sort: number; // 排序

  @Column({ type: 'uuid', nullable: true })
  parent_id: string; // 父分类 ID

  @Column({ type: 'int', default: 1 })
  status: number; // 状态 0-禁用 1-启用

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // 关联
  @ManyToOne(() => ProductCategory, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: ProductCategory;

  @OneToMany(() => ProductCategory, (category) => category.parent)
  children: ProductCategory[];
}
