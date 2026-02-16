# 微信小程序单商户商城后端架构设计

## 📋 项目概述

基于 NestJS 构建的微信小程序单商户商城后端系统，提供完整的电商功能，包括用户、商品、订单、会员、营销等核心模块。

---

## 🎯 核心功能模块

### 1. 用户系统 (User Module)
- **H5 端登录（新增）**
  - 账号密码登录
  - 手机验证码登录（固定验证码：8808）
- **微信登录/注册**
  - 微信小程序授权登录
  - 微信手机号快速登录
  - JWT Token 认证与刷新
- **用户信息管理**
  - 用户资料编辑（昵称、头像、性别等）
  - 实名认证（可选）
- **用户地址管理**
  - 收货地址 CRUD
  - 默认地址设置
  - 地址智能识别（地址解析）
- **用户行为记录**
  - 浏览历史
  - 收藏商品
  - 浏览足迹

### 2. 商品系统 (Product Module)
- **商品分类**
  - 多级分类树形结构
  - 分类属性管理
  - 分类排序
- **商品管理 (SPU/SKU)**
  - SPU (标准产品单元)：商品基础信息
  - SKU (库存单元)：规格、价格、库存
  - 多规格支持（颜色、尺寸等）
  - 商品上下架
- **商品库存**
  - 库存扣减与释放
  - 库存预警
  - 库存日志
- **商品评价**
  - 评价 CRUD
  - 评价图片上传
  - 评价回复
  - 评价统计
- **商品搜索**
  - 全文检索 (Elasticsearch)
  - 分类筛选
  - 价格区间筛选
  - 热门搜索记录

### 3. 订单系统 (Order Module)
- **购物车**
  - 加入购物车
  - 数量修改
  - 购物车结算
  - 优惠券应用
- **订单创建**
  - 订单信息确认
  - 地址选择
  - 运费计算
  - 优惠券计算
  - 优惠金额计算
- **订单支付**
  - 微信支付 (小程序支付)
  - 支付回调处理
  - 支付超时取消
- **订单状态管理**
  - 待付款 → 待发货 → 待收货 → 已完成
  - 订单取消（超时自动取消）
  - 订单删除
- **订单物流**
  - 物流信息查询
  - 物流轨迹追踪
  - 物流公司管理
- **退款/售后**
  - 退款申请
  - 退款审核
  - 退款处理（原路退回）
  - 售后记录

### 4. 会员系统 (Member Module)
- **会员等级**
  - 等级规则配置
  - 等级升级条件（消费金额、订单数量）
  - 等级权益配置（折扣、积分倍数）
- **会员积分**
  - 积分获取（下单、评价、签到）
  - 积分消费（兑换商品、抵扣）
  - 积分记录（获取/消费日志）
  - 积分过期管理
- **会员标签**
  - 标签管理（新用户、活跃用户、沉睡用户）
  - 标签自动打标规则
  - 基于标签的营销策略
- **会员卡**
  - 会员卡管理（实体卡/虚拟卡）
  - 会员卡权益
  - 会员卡充值

### 5. 营销活动系统 (Marketing Module)
- **优惠券**
  - 优惠券类型（满减券、折扣券、无门槛券）
  - 优惠券创建（数量、有效期、使用条件）
  - 优惠券领取（限制领取次数）
  - 优惠券使用
  - 优惠券核销
- **限时秒杀**
  - 秒杀活动创建
  - 秒杀商品配置
  - 秒杀库存管理（Redis 预扣减）
  - 秒杀时间控制
  - 秒杀限流
- **满减活动**
  - 满减规则配置（满 X 减 Y）
  - 满减活动时间
  - 与优惠券叠加规则
- **拼团活动**
  - 拼团活动创建
  - 拼团团长优惠
  - 拼团人数设置
  - 拼团状态管理（拼团中/拼团成功/拼团失败）
  - 拼团超时自动退款

### 6. 支付系统 (Payment Module)
- **支付方式**
  - 微信支付（小程序支付）
  - 支付宝支付（可选）
- **支付功能**
  - 统一下单
  - 支付查询
  - 退款申请
  - 退款查询
  - 支付回调处理
  - 对账功能

### 7. 消息通知系统 (Notification Module)
- **消息类型**
  - 订单状态变更通知
  - 支付成功通知
  - 发货通知
  - 退款通知
  - 营销活动通知
- **通知渠道**
  - 微信模板消息
  - 微信订阅消息
  - 短信通知（可选）
- **消息模板**
  - 模板管理
  - 模板参数配置

### 8. 管理后台系统 (Admin Module)
- **商品管理**
  - 商品 CRUD
  - 分类管理
  - 规格管理
- **订单管理**
  - 订单列表
  - 订单详情
  - 订单发货
  - 订单退款
- **用户管理**
  - 用户列表
  - 用户详情
  - 用户封禁
- **营销管理**
  - 活动配置
  - 优惠券管理
- **数据统计**
  - 订单统计
  - 销售统计
  - 用户统计
  - 商品统计

### 9. 系统配置 (Config Module)
- **商城配置**
  - 商城名称、LOGO
  - 客服电话
  - 物流公司配置
- **支付配置**
  - 微信支付配置（AppID、MchID、API Key）
  - 支付宝配置（可选）
- **其他配置**
  - 上传配置（OSS、COS）
  - 短信配置
  - 微信小程序配置

---

## 🏗️ 技术架构

### 技术栈选择

#### 后端框架
- **NestJS v10+** - 渐进式 Node.js 框架
  - 优点：模块化、依赖注入、装饰器、TypeScript 原生支持
  - 适合：中大型项目、微服务架构

#### 数据库层
- **PostgreSQL 14+** - 关系型数据库
  - 优点：开源、JSON 支持、事务支持、性能优秀
  - 用途：存储核心业务数据（用户、订单、商品等）

- **MongoDB 6+** - 文档数据库
  - 优点：灵活的 Schema、适合非结构化数据
  - 用途：存储商品详情、评论、日志等

- **Redis 7+** - 缓存和消息队列
  - 优点：高性能、支持多种数据结构
  - 用途：缓存、分布式锁、Session、限流

#### ORM/ODM
- **TypeORM** - PostgreSQL 的 ORM
  - 优点：装饰器语法、迁移系统、关联查询
  - 用途：PostgreSQL 数据库操作

- **Mongoose** - MongoDB 的 ODM
  - 优点：Schema 定义、中间件、类型安全
  - 用途：MongoDB 数据库操作

#### 认证与授权
- **Passport.js** - 认证中间件
  - JWT Strategy - JWT Token 认证（用于所有端）
  - Wechat Strategy - 微信登录（小程序端）
  - 支持多种登录方式：微信、账号密码、手机验证码

- **JWT Token 认证**
  - Access Token 有效期：2 小时
  - Refresh Token 有效期：7 天
  - Token 存储在 Redis，支持主动失效
  - 自动 Token 刷新机制

- **登录方式**（新增 H5 支持）
  - 1. 微信登录（小程序端）- 微信授权码登录
  - 2. 账号密码登录（H5 端）- 用户名 + 密码
  - 3. 手机验证码登录（H5 端）- 手机号 + 验证码（固定 8808）

- **RBAC (Role-Based Access Control)** - 基于角色的权限控制
  - 角色：普通用户、管理员、超级管理员
  - 权限：模块级权限、操作级权限
  - JWT 守卫：自动验证所有需要认证的接口
  - 公开接口装饰器：标记不需要认证的接口（登录、注册等）

#### 消息队列
- **BullMQ** - 基于 Redis 的消息队列
  - 优点：支持重试、延迟任务、优先级
  - 用途：异步任务（发送通知、订单超时取消）

#### 文件存储
- **阿里云 OSS** 或 **腾讯云 COS**
  - 优点：高可用、CDN 加速
  - 用途：商品图片、用户头像等静态资源

#### 搜索引擎
- **Elasticsearch 8+** - 全文检索引擎
  - 优点：强大的搜索能力、分布式
  - 用途：商品搜索、日志分析

#### API 文档
- **Swagger / OpenAPI** - API 文档自动生成
  - 优点：自动生成文档、在线调试
  - 用途：前后端接口对接

#### 第三方服务
- **微信支付 SDK** - 微信支付对接
- **腾讯云短信** - 短信发送（可选）
- **微信小程序登录** - 用户认证

---

## 📊 数据库设计

### PostgreSQL 表结构

#### 用户相关
```sql
-- 用户表（扩展支持 H5 端）
users (
  id: UUID PRIMARY KEY,
  openid: VARCHAR UNIQUE,           -- 微信 OpenID
  unionid: VARCHAR,                  -- 微信 UnionID
  username: VARCHAR UNIQUE,           -- 用户名（H5 端登录用）
  password: VARCHAR,                  -- 密码（BCrypt 加密）
  nickname: VARCHAR,                 -- 昵称
  avatar: VARCHAR,                   -- 头像
  phone: VARCHAR,                    -- 手机号
  gender: INT,                       -- 性别 0-未知 1-男 2-女
  level: INT DEFAULT 1,              -- 会员等级
  points: INT DEFAULT 0,             -- 积分
  status: INT DEFAULT 1,             -- 状态 0-禁用 1-正常
  login_type: INT DEFAULT 1,         -- 登录类型 1-微信 2-账号密码 3-手机验证码
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  last_login_at: TIMESTAMP            -- 最后登录时间
)

-- 用户地址表
user_addresses (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  name: VARCHAR,                    -- 收货人
  phone: VARCHAR,                    -- 手机号
  province: VARCHAR,                 -- 省份
  city: VARCHAR,                     -- 城市
  district: VARCHAR,                 -- 区县
  detail: VARCHAR,                   -- 详细地址
  is_default: BOOLEAN DEFAULT FALSE, -- 是否默认
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### 商品相关
```sql
-- 商品分类表
categories (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                     -- 分类名称
  parent_id: UUID REFERENCES categories(id), -- 父分类
  level: INT,                        -- 层级
  icon: VARCHAR,                     -- 图标
  sort: INT DEFAULT 0,               -- 排序
  status: INT DEFAULT 1,             -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 商品 SPU 表
products (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                     -- 商品名称
  category_id: UUID REFERENCES categories(id),
  description: TEXT,                 -- 商品描述
  main_image: VARCHAR,               -- 主图
  images: TEXT[],                    -- 图片数组
  status: INT DEFAULT 1,             -- 状态 0-下架 1-上架
  sales: INT DEFAULT 0,              -- 销量
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 商品 SKU 表
product_skus (
  id: UUID PRIMARY KEY,
  product_id: UUID REFERENCES products(id),
  name: VARCHAR,                     -- SKU 名称（如：红色 XL）
  spec: JSONB,                       -- 规格属性 {"颜色": "红色", "尺寸": "XL"}
  price: DECIMAL(10,2),             -- 价格
  original_price: DECIMAL(10,2),     -- 原价
  stock: INT DEFAULT 0,              -- 库存
  status: INT DEFAULT 1,             -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 商品库存变动日志表
stock_logs (
  id: UUID PRIMARY KEY,
  sku_id: UUID REFERENCES product_skus(id),
  type: INT,                        -- 类型 1-入库 2-出库
  quantity: INT,                    -- 数量
  order_id: UUID REFERENCES orders(id), -- 关联订单
  remark: VARCHAR,                  -- 备注
  created_at: TIMESTAMP
)
```

#### 订单相关
```sql
-- 购物车表
cart_items (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  sku_id: UUID REFERENCES product_skus(id),
  quantity: INT DEFAULT 1,           -- 数量
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 订单表
orders (
  id: UUID PRIMARY KEY,
  order_no: VARCHAR UNIQUE,         -- 订单号
  user_id: UUID REFERENCES users(id),
  address_id: UUID REFERENCES user_addresses(id),
  total_amount: DECIMAL(10,2),      -- 订单总额
  discount_amount: DECIMAL(10,2) DEFAULT 0, -- 优惠金额
  freight: DECIMAL(10,2) DEFAULT 0, -- 运费
  actual_amount: DECIMAL(10,2),     -- 实付金额
  status: INT DEFAULT 0,             -- 订单状态 0-待付款 1-待发货 2-待收货 3-已完成 4-已取消 5-售后中
  payment_status: INT DEFAULT 0,    -- 支付状态 0-未支付 1-已支付 2-退款中 3-已退款
  payment_method: VARCHAR,          -- 支付方式
  transaction_id: VARCHAR,          -- 第三方交易号
  remark: VARCHAR,                   -- 备注
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  paid_at: TIMESTAMP,               -- 支付时间
  shipped_at: TIMESTAMP,             -- 发货时间
  completed_at: TIMESTAMP,          -- 完成时间
  canceled_at: TIMESTAMP,           -- 取消时间
)

-- 订单明细表
order_items (
  id: UUID PRIMARY KEY,
  order_id: UUID REFERENCES orders(id),
  product_id: UUID REFERENCES products(id),
  sku_id: UUID REFERENCES product_skus(id),
  product_name: VARCHAR,            -- 商品名称（快照）
  sku_name: VARCHAR,                -- SKU 名称（快照）
  spec: JSONB,                      -- 规格（快照）
  price: DECIMAL(10,2),             -- 购买价格（快照）
  quantity: INT,                    -- 数量
  created_at: TIMESTAMP
)

-- 订单物流表
order_logistics (
  id: UUID PRIMARY KEY,
  order_id: UUID REFERENCES orders(id),
  company: VARCHAR,                 -- 物流公司
  tracking_number: VARCHAR,         -- 运单号
  status: INT DEFAULT 0,            -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### 会员相关
```sql
-- 会员等级表
member_levels (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 等级名称
  level: INT UNIQUE,                -- 等级数值
  min_amount: DECIMAL(10,2),        -- 升级所需最低消费
  min_orders: INT,                  -- 升级所需最低订单数
  discount: DECIMAL(3,2),           -- 折扣（如 0.95 表示 95 折）
  points_rate: INT DEFAULT 1,       -- 积分倍数
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 积分记录表
points_logs (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  type: INT,                        -- 类型 1-获取 2-消费
  points: INT,                      -- 积分数量
  balance: INT,                      -- 余额
  reason: VARCHAR,                  -- 原因
  order_id: UUID REFERENCES orders(id), -- 关联订单
  created_at: TIMESTAMP
)

-- 会员标签表
member_tags (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 标签名称
  type: INT,                        -- 类型 1-系统标签 2-自定义标签
  rule: JSONB,                      -- 自动打标规则
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 用户标签关联表
user_tags (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  tag_id: UUID REFERENCES member_tags(id),
  created_at: TIMESTAMP
)
```

#### 营销相关
```sql
-- 优惠券表
coupons (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 优惠券名称
  type: INT,                        -- 类型 1-满减券 2-折扣券 3-无门槛券
  discount_amount: DECIMAL(10,2),   -- 减免金额
  discount_rate: DECIMAL(3,2),      -- 折扣率
  min_amount: DECIMAL(10,2),        -- 最低使用金额
  total_quantity: INT,              -- 发行总量
  received_quantity: INT DEFAULT 0, -- 已领取数量
  used_quantity: INT DEFAULT 0,      -- 已使用数量
  limit_per_user: INT DEFAULT 1,     -- 每人限领数量
  valid_days: INT,                  -- 有效期（天）
  start_time: TIMESTAMP,            -- 生效时间
  end_time: TIMESTAMP,              -- 过期时间
  status: INT DEFAULT 1,            -- 状态 0-禁用 1-启用
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 用户优惠券表
user_coupons (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  coupon_id: UUID REFERENCES coupons(id),
  status: INT DEFAULT 0,            -- 状态 0-未使用 1-已使用 2-已过期
  used_at: TIMESTAMP,               -- 使用时间
  expire_at: TIMESTAMP,             -- 过期时间
  created_at: TIMESTAMP
)

-- 秒杀活动表
seckill_activities (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 活动名称
  start_time: TIMESTAMP,            -- 开始时间
  end_time: TIMESTAMP,              -- 结束时间
  status: INT DEFAULT 1,            -- 状态 0-禁用 1-启用
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 秒杀商品表
seckill_products (
  id: UUID PRIMARY KEY,
  activity_id: UUID REFERENCES seckill_activities(id),
  sku_id: UUID REFERENCES product_skus(id),
  seckill_price: DECIMAL(10,2),    -- 秒杀价
  stock: INT,                       -- 秒杀库存
  limit_per_user: INT,              -- 每人限购
  sort: INT DEFAULT 0,              -- 排序
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 拼团活动表
group_activities (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 活动名称
  product_id: UUID REFERENCES products(id),
  sku_id: UUID REFERENCES product_skus(id),
  group_price: DECIMAL(10,2),      -- 拼团价
  original_price: DECIMAL(10,2),    -- 原价
  group_size: INT DEFAULT 2,        -- 拼团人数
  leader_discount: DECIMAL(3,2),    -- 团长优惠
  expire_hours: INT DEFAULT 24,     -- 有效时长（小时）
  start_time: TIMESTAMP,            -- 开始时间
  end_time: TIMESTAMP,              -- 结束时间
  status: INT DEFAULT 1,            -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 拼团记录表
group_records (
  id: UUID PRIMARY KEY,
  activity_id: UUID REFERENCES group_activities(id),
  leader_id: UUID REFERENCES users(id), -- 团长 ID
  order_id: UUID REFERENCES orders(id),  -- 团长订单
  current_size: INT DEFAULT 1,      -- 当前人数
  status: INT DEFAULT 0,            -- 状态 0-拼团中 1-拼团成功 2-拼团失败
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 拼团成员表
group_members (
  id: UUID PRIMARY KEY,
  group_id: UUID REFERENCES group_records(id),
  user_id: UUID REFERENCES users(id),
  order_id: UUID REFERENCES orders(id),
  join_time: TIMESTAMP,             -- 参团时间
  created_at: TIMESTAMP
)
```

#### 支付相关
```sql
-- 支付记录表
payments (
  id: UUID PRIMARY KEY,
  order_id: UUID REFERENCES orders(id),
  order_no: VARCHAR,                -- 订单号
  amount: DECIMAL(10,2),            -- 金额
  method: VARCHAR,                  -- 支付方式（wechat、alipay）
  status: INT DEFAULT 0,            -- 状态 0-待支付 1-已支付 2-已退款
  transaction_id: VARCHAR,          -- 第三方交易号
  prepay_id: VARCHAR,               -- 预支付 ID
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  paid_at: TIMESTAMP
)

-- 退款记录表
refunds (
  id: UUID PRIMARY KEY,
  payment_id: UUID REFERENCES payments(id),
  order_id: UUID REFERENCES orders(id),
  amount: DECIMAL(10,2),            -- 退款金额
  reason: VARCHAR,                  -- 退款原因
  status: INT DEFAULT 0,            -- 状态 0-申请中 1-退款成功 2-退款失败
  refund_id: VARCHAR,               -- 退款单号
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  refunded_at: TIMESTAMP            -- 退款时间
)
```

#### 系统相关
```sql
-- 系统配置表
system_configs (
  id: UUID PRIMARY KEY,
  key: VARCHAR UNIQUE,              -- 配置键
  value: TEXT,                      -- 配置值
  type: VARCHAR,                    -- 类型（string、number、boolean、json）
  description: VARCHAR,              -- 描述
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 物流公司表
logistics_companies (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- 公司名称
  code: VARCHAR UNIQUE,             -- 公司代码
  phone: VARCHAR,                   -- 客服电话
  status: INT DEFAULT 1,            -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- 管理员表
admins (
  id: UUID PRIMARY KEY,
  username: VARCHAR UNIQUE,         -- 用户名
  password: VARCHAR,                -- 密码（加密）
  name: VARCHAR,                    -- 姓名
  role: VARCHAR,                    -- 角色（admin、super_admin）
  status: INT DEFAULT 1,            -- 状态
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  last_login_at: TIMESTAMP,         -- 最后登录时间
)
```

### MongoDB 集合结构

```javascript
// 商品详情集合
product_details {
  _id: ObjectId,
  product_id: UUID,
  detail: String,                   // 富文本详情
  attributes: Array,                // 商品属性
  specifications: Array,            // 规格说明
  created_at: Date,
  updated_at: Date
}

// 商品评论集合
product_reviews {
  _id: ObjectId,
  user_id: UUID,
  product_id: UUID,
  sku_id: UUID,
  rating: Int,                      // 评分 1-5
  content: String,                  // 评论内容
  images: Array,                    // 评论图片
  is_anonymous: Boolean,            // 是否匿名
  reply_content: String,            // 商家回复
  reply_time: Date,
  created_at: Date,
  updated_at: Date
}

// 用户浏览历史集合
user_browsing_history {
  _id: ObjectId,
  user_id: UUID,
  product_id: UUID,
  viewed_at: Date
}

// 用户收藏集合
user_favorites {
  _id: ObjectId,
  user_id: UUID,
  product_id: UUID,
  created_at: Date
}

// 热门搜索记录集合
hot_searches {
  _id: ObjectId,
  keyword: String,
  count: Int,
  updated_at: Date
}

// 系统日志集合
system_logs {
  _id: ObjectId,
  module: String,                   // 模块
  action: String,                   // 操作
  user_id: UUID,
  ip: String,
  user_agent: String,
  data: Object,                     // 请求数据
  response: Object,                 // 响应数据
  created_at: Date
}
```

---

## 🔐 安全设计

### 认证与授权
1. **JWT 认证**
   - Access Token 有效期：2 小时
   - Refresh Token 有效期：7 天
   - Token 存储在 Redis，支持主动失效

2. **RBAC 权限控制**
   - 角色管理：普通用户、管理员、超级管理员
   - 权限控制：模块级、操作级
   - API 级别权限验证

3. **微信登录安全**
   - OpenID + UnionID 绑定
   - Session 验证
   - 防重放攻击

### 数据安全
1. **敏感数据加密**
   - 用户手机号脱敏（138****1234）
   - 支付信息加密存储
   - 密码 BCrypt 加密

2. **SQL 注入防护**
   - TypeORM 参数化查询
   - 输入验证
   - 特殊字符过滤

3. **XSS 防护**
   - 输入过滤
   - 输出编码
   - CSP 策略

### 接口安全
1. **限流**
   - 滑动窗口算法
   - API 级别限流
   - IP 级别限流

2. **防重放**
   - 请求签名
   - 时间戳验证
   - Nonce 机制

3. **HTTPS**
   - 强制 HTTPS
   - HSTS 策略

---

## 🚀 性能优化

### 缓存策略
1. **Redis 缓存**
   - 用户信息缓存（30 分钟）
   - 商品信息缓存（10 分钟）
   - 分类列表缓存（1 小时）
   - 热门商品缓存（5 分钟）
   - 配置信息缓存（永久）
   - 缓存预热

2. **缓存失效**
   - 主动失效（数据更新时删除缓存）
   - 被动失效（TTL 过期）
   - 缓存雪崩预防（随机 TTL）

### 数据库优化
1. **索引优化**
   - 主键索引
   - 唯一索引
   - 复合索引
   - 全文索引（PostgreSQL）

2. **查询优化**
   - 避免 N+1 查询
   - 分页查询（游标分页）
   - 延迟加载
   - 只查询需要的字段

3. **读写分离**
   - 主库写操作
   - 从库读操作
   - 中间件路由

### 异步处理
1. **消息队列**
   - 支付回调处理
   - 订单超时取消
   - 消息通知发送
   - 数据统计计算

2. **延迟任务**
   - 订单自动收货（7 天后）
   - 优惠券过期提醒
   - 积分过期处理

---

## 📈 监控与日志

### 日志系统
1. **日志级别**
   - ERROR：错误日志
   - WARN：警告日志
   - INFO：信息日志
   - DEBUG：调试日志

2. **日志内容**
   - 请求日志（API 访问）
   - 错误日志（异常堆栈）
   - 业务日志（关键操作）
   - 性能日志（响应时间）

3. **日志存储**
   - 文件日志（按天分割）
   - 日志聚合（可选 ELK）
   - 日志保留（30 天）

### 监控指标
1. **应用监控**
   - QPS（每秒请求数）
   - 响应时间（平均、P95、P99）
   - 错误率
   - CPU、内存使用率

2. **业务监控**
   - 订单量
   - 注册用户数
   - 支付成功率
   - 库存预警

3. **告警配置**
   - 错误率超过 5%
   - 响应时间超过 1s
   - 库存低于阈值
   - 支付失败率超过 10%

---

## 🔧 开发规范

### 代码规范
1. **代码风格**
   - ESLint + Prettier
   - Airbnb JavaScript 规范
   - 统一代码格式

2. **命名规范**
   - 文件名：kebab-case（user.service.ts）
   - 类名：PascalCase（UserService）
   - 方法名：camelCase（getUserById）
   - 常量：UPPER_SNAKE_CASE（MAX_RETRY）

3. **注释规范**
   - 类注释：用途说明
   - 方法注释：参数、返回值说明
   - 复杂逻辑注释：说明原因

### Git 规范
1. **分支管理**
   - main：生产环境
   - develop：开发环境
   - feature/*：功能分支
   - bugfix/*：修复分支
   - hotfix/*：紧急修复

2. **提交规范**
   - feat：新功能
   - fix：修复 bug
   - docs：文档更新
   - style：代码格式
   - refactor：重构
   - test：测试
   - chore：构建/工具

3. **Commit Message 格式**
   ```
   feat(order): add order status update API

   - Update order status from pending to shipped
   - Send notification to user
   ```

### API 规范
1. **RESTful API**
   - GET：查询
   - POST：创建
   - PUT：更新（全部）
   - PATCH：更新（部分）
   - DELETE：删除

2. **统一响应格式**
   ```typescript
   {
     code: 200,           // 状态码
     message: "success",  // 消息
     data: {},            // 数据
     timestamp: 1234567890
   }
   ```

3. **错误码规范**
   - 200：成功
   - 400：参数错误
   - 401：未登录
   - 403：无权限
   - 404：资源不存在
   - 500：服务器错误

---

## 📦 项目目录结构

```
wechat-miniprogram-mall/
├── src/
│   ├── main.ts                          # 应用入口
│   ├── app.module.ts                    # 根模块
│   ├── common/                          # 公共模块
│   │   ├── decorators/                  # 装饰器
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/                     # 异常过滤器
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── guards/                      # 守卫
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/                # 拦截器
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/                       # 管道
│   │   │   └── validation.pipe.ts
│   │   ├── dtos/                        # 公共 DTO
│   │   │   ├── response.dto.ts
│   │   │   └── pagination.dto.ts
│   │   ├── utils/                       # 工具类
│   │   │   ├── crypto.util.ts
│   │   │   ├── date.util.ts
│   │   │   └── string.util.ts
│   │   └── constants/                   # 常量
│   │       ├── error-code.constants.ts
│   │       └── redis-key.constants.ts
│   ├── config/                          # 配置模块
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── database.config.ts
│   ├── modules/                         # 业务模块
│   │   ├── auth/                        # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── wechat.strategy.ts
│   │   │   └── dtos/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── user/                        # 用户模块
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user-address.entity.ts
│   │   │   └── dtos/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── user.dto.ts
│   │   ├── product/                     # 商品模块
│   │   │   ├── product.module.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   ├── category/                    # 分类模块
│   │   │   ├── category.module.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   ├── order/                       # 订单模块
│   │   │   ├── order.module.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   ├── cart/                        # 购物车模块
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   ├── payment/                     # 支付模块
│   │   │   ├── payment.module.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   ├── member/                      # 会员模块
│   │   │   ├── member.module.ts
│   │   │   ├── member.controller.ts
│   │   │   ├── member.service.ts
│   │   ├── marketing/                   # 营销模块
│   │   │   ├── marketing.module.ts
│   │   │   ├── coupon/
│   │   │   │   ├── coupon.module.ts
│   │   │   │   ├── coupon.controller.ts
│   │   │   │   └── coupon.service.ts
│   │   │   ├── seckill/
│   │   │   │   ├── seckill.module.ts
│   │   │   │   ├── seckill.controller.ts
│   │   │   │   └── seckill.service.ts
│   │   │   └── group/
│   │   │       ├── group.module.ts
│   │   │       ├── group.controller.ts
│   │   │       └── group.service.ts
│   │   ├── notification/                 # 通知模块
│   │   │   ├── notification.module.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── notification.service.ts
│   │   ├── admin/                       # 管理后台模块
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   └── statistics/                  # 统计模块
│   │       ├── statistics.module.ts
│   │       ├── statistics.controller.ts
│   │       └── statistics.service.ts
│   ├── jobs/                            # 定时任务
│   │   ├── order-cancel.job.ts
│   │   ├── order-complete.job.ts
│   │   └── coupon-expire.job.ts
│   └── database/                        # 数据库迁移
│       ├── migrations/
│       └── seeds/
├── test/                                # 测试文件
├── docs/                                # 文档
├── scripts/                             # 脚本
├── .env.example                         # 环境变量示例
├── .eslintrc.js                         # ESLint 配置
├── .prettierrc                          # Prettier 配置
├── .gitignore                           # Git 忽略
├── nest-cli.json                        # Nest CLI 配置
├── package.json                         # 依赖配置
├── tsconfig.json                        # TypeScript 配置
├── tsconfig.build.json                  # TypeScript 编译配置
└── README.md                            # 项目说明
```

---

## 🛠️ 开发工具推荐

### IDE
- **VS Code** + 推荐插件
  - ESLint
  - Prettier
  - GitLens
  - REST Client

### API 测试
- **Postman** / **Apifox**
- **Swagger UI**（自动生成）

### 数据库管理
- **DBeaver** / **Navicat**
- **MongoDB Compass**

### 性能分析
- **Chrome DevTools**
- **Node.js Profiler**

---

## 📝 开发流程

### 第一阶段：基础架构搭建
1. 初始化 NestJS 项目
2. 配置数据库连接（PostgreSQL、MongoDB、Redis）
3. 配置 Swagger API 文档
4. 搭建统一响应格式和异常处理
5. 搭建日志系统
6. 配置 ESLint 和 Prettier

### 第二阶段：核心功能开发
1. 用户系统（登录、注册、用户信息管理）
2. 商品系统（商品、分类、SKU 管理）
3. 购物车功能
4. 订单系统（创建、支付、状态流转）
5. 支付集成（微信支付）

### 第三阶段：营销功能开发
1. 优惠券系统
2. 秒杀活动
3. 拼团活动
4. 满减活动

### 第四阶段：会员与通知
1. 会员等级与积分
2. 消息通知系统
3. 统计分析功能

### 第五阶段：优化与部署
1. 性能优化（缓存、索引、异步处理）
2. 安全加固
3. 部署配置（Docker、CI/CD）
4. 监控告警

---

## 🎯 关键技术难点

### 1. 秒杀高并发
- Redis 预扣减库存
- 消息队列异步下单
- 分布式锁防止超卖
- 限流保护

### 2. 订单超时取消
- 延迟队列（BullMQ）
- 定时任务扫描
- 状态机设计

### 3. 分布式事务
- 最终一致性
- 本地消息表
- 补偿机制

### 4. 数据一致性
- 缓存更新策略
- 数据库事务
- 乐观锁/悲观锁

---

## 📚 参考资料

### 官方文档
- [NestJS 文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)
- [Redis 文档](https://redis.io/docs/)
- [Elasticsearch 文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

### 微信开发
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信支付文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)

### 设计模式
- [领域驱动设计 (DDD)](https://martinfowler.com/tags/domain%20driven%20design.html)
- [微服务架构](https://microservices.io/)

---

## 🚦 下一步行动

1. ✅ 创建项目目录结构
2. ✅ 初始化 Git 仓库
3. ✅ 编写架构设计文档
4. ⏳ 提交到 Git 仓库
5. ⏳ 开始初始化 NestJS 项目
6. ⏳ 开发基础架构

---

*架构设计完成，接下来可以开始编码了～*
