import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * 用户实体（PostgreSQL）
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  openid: string; // 微信 OpenID

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  unionid: string; // 微信 UnionID

  @Column({ type: 'varchar', length: 50 })
  username: string; // 用户名（H5 端登录用）

  @Column({ type: 'varchar', length: 255 })
  password: string; // 密码（加密）

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string; // 手机号

  @Column({ type: 'varchar', length: 100 })
  nickname: string; // 昵称

  @Column({ type: 'varchar', length: 500 })
  avatar: string; // 头像

  @Column({ type: 'int', default: 0 })
  gender: number; // 性别 0-未知 1-男 2-女

  @Column({ type: 'int', default: 1 })
  level: number; // 会员等级

  @Column({ type: 'int', default: 0 })
  points: number; // 积分

  @Column({ type: 'int', default: 1 })
  status: number; // 状态 0-禁用 1-正常

  @Column({ type: 'int', default: 0 })
  loginType: number; // 登录类型 1-微信 2-账号密码 3-手机验证码

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date; // 最后登录时间
}
