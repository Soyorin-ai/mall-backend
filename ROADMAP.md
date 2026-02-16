# 开发路线图

本文档详细说明项目的开发计划和里程碑。

---

## 🎯 总体目标

构建一个功能完整、性能优秀、易于维护的微信小程序单商户商城后端系统。

**预计开发周期：** 2-3 个月

---

## 📅 开发阶段

### 第一阶段：基础架构搭建（1-2 周）

**目标：** 搭建项目基础架构，完成开发环境配置

**任务清单：**

#### Week 1
- [x] 初始化 NestJS 项目
- [ ] 配置 TypeScript、ESLint、Prettier
- [ ] 配置环境变量管理
- [ ] 配置 Git 规范（Husky + lint-staged）
- [ ] 配置数据库连接（PostgreSQL）
- [ ] 配置 MongoDB 连接
- [ ] 配置 Redis 连接
- [ ] 编写数据库初始化脚本
- [ ] 配置 Swagger API 文档

#### Week 2
- [ ] 搭建统一响应格式
- [ ] 搭建全局异常处理
- [ ] 搭建日志系统（Winston）
- [ ] 搭建拦截器（日志、转换）
- [ ] 搭建管道（参数验证）
- [ ] 搭建设守（认证、权限）
- [ ] 编写基础工具类
- [ ] 编写常量定义
- [ ] 编写基础装饰器

**验收标准：**
- ✅ 项目可以正常启动
- ✅ Swagger 文档可以访问
- ✅ 数据库连接正常
- ✅ 统一响应格式正常
- ✅ 日志记录正常

---

### 第二阶段：核心功能开发（3-4 周）

**目标：** 完成用户、商品、订单、支付等核心功能

#### Week 3: 用户系统
- [ ] 用户实体设计
- [ ] 微信登录接口
- [ ] 手机号登录接口
- [ ] Token 生成与刷新
- [ ] 用户信息查询/更新
- [ ] 用户地址 CRUD
- [ ] 用户收藏管理
- [ ] 用户浏览历史

**关键接口：**
```
POST /api/auth/login          # 微信登录
POST /api/auth/refresh         # 刷新 Token
GET  /api/user/profile         # 用户信息
PUT  /api/user/profile         # 更新信息
GET  /api/user/addresses       # 地址列表
POST /api/user/addresses       # 添加地址
PUT  /api/user/addresses/:id   # 更新地址
DELETE /api/user/addresses/:id # 删除地址
```

#### Week 4: 商品系统
- [ ] 商品分类 CRUD
- [ ] 商品 SPU CRUD
- [ ] 商品 SKU CRUD
- [ ] 商品库存管理
- [ ] 商品上架/下架
- [ ] 商品列表（分页、筛选）
- [ ] 商品详情查询

**关键接口：**
```
GET    /api/products           # 商品列表
GET    /api/products/:id       # 商品详情
GET    /api/categories         # 分类列表
GET    /api/categories/:id     # 分类详情
GET    /api/products/:id/skus   # 商品 SKU 列表
POST   /api/admin/products     # 添加商品（后台）
PUT    /api/admin/products/:id # 更新商品（后台）
```

#### Week 5: 购物车与订单
- [ ] 购物车 CRUD
- [ ] 购物车结算
- [ ] 订单创建
- [ ] 订单状态流转
- [ ] 订单列表
- [ ] 订单详情
- [ ] 订单取消

**关键接口：**
```
GET    /api/cart               # 购物车列表
POST   /api/cart               # 加入购物车
PUT    /api/cart/:id           # 更新数量
DELETE /api/cart/:id           # 删除商品
POST   /api/orders             # 创建订单
GET    /api/orders             # 订单列表
GET    /api/orders/:id         # 订单详情
DELETE /api/orders/:id         # 取消订单
```

#### Week 6: 支付集成
- [ ] 微信支付 SDK 集成
- [ ] 统一下单接口
- [ ] 支付回调处理
- [ ] 支付查询接口
- [ ] 退款接口
- [ ] 退款回调处理
- [ ] 支付状态同步

**关键接口：**
```
POST /api/payment/create       # 创建支付
POST /api/payment/notify       # 支付回调
GET  /api/payment/query        # 查询支付
POST /api/payment/refund       # 申请退款
POST /api/payment/refund/notify # 退款回调
```

**验收标准：**
- ✅ 用户可以正常登录
- ✅ 可以浏览商品
- ✅ 可以加入购物车
- ✅ 可以下单支付
- ✅ 订单状态正常流转

---

### 第三阶段：营销功能开发（2-3 周）

**目标：** 完成优惠券、秒杀、拼团等营销功能

#### Week 7: 优惠券系统
- [ ] 优惠券 CRUD（后台）
- [ ] 优惠券领取
- [ ] 我的优惠券列表
- [ ] 优惠券使用
- [ ] 优惠券核销
- [ ] 优惠券过期处理

**关键接口：**
```
POST   /api/coupons/:id/claim  # 领取优惠券
GET    /api/user/coupons       # 我的优惠券
POST   /api/coupons/validate   # 验证优惠券
POST   /api/admin/coupons      # 创建优惠券（后台）
```

#### Week 8: 秒杀系统
- [ ] 秒杀活动 CRUD
- [ ] 秒杀商品配置
- [ ] Redis 预扣减库存
- [ ] 秒杀下单接口
- [ ] 秒杀限流
- [ ] 秒杀时间控制

**关键接口：**
```
GET    /api/seckill            # 秒杀活动列表
GET    /api/seckill/:id        # 秒杀活动详情
POST   /api/seckill/:id/order  # 秒杀下单
POST   /api/admin/seckill      # 创建秒杀活动（后台）
```

**关键技术点：**
- Redis 分布式锁
- 消息队列异步下单
- 库存预热
- 限流保护

#### Week 9: 拼团系统
- [ ] 拼团活动 CRUD
- [ ] 发起拼团
- [ ] 参与拼团
- [ ] 拼团状态管理
- [ ] 拼团超时退款
- [ ] 拼团成功通知

**关键接口：**
```
GET    /api/group              # 拼团活动列表
GET    /api/group/:id          # 拼团活动详情
POST   /api/group/:id/join     # 参与拼团
GET    /api/user/groups        # 我的拼团
POST   /api/admin/group        # 创建拼团活动（后台）
```

**验收标准：**
- ✅ 优惠券可以正常领取和使用
- ✅ 秒杀活动正常运行
- ✅ 拼团功能正常
- ✅ 高并发场景下不出现超卖

---

### 第四阶段：会员与通知（1-2 周）

**目标：** 完成会员系统和消息通知功能

#### Week 10: 会员系统
- [ ] 会员等级管理
- [ ] 会员积分获取
- [ ] 会员积分消费
- [ ] 会员升级逻辑
- [ ] 会员标签管理
- [ ] 积分过期处理

**关键接口：**
```
GET    /api/member/info        # 会员信息
GET    /api/member/points      # 积分记录
GET    /api/member/levels      # 等级列表
POST   /api/admin/levels       # 创建等级（后台）
```

#### Week 11: 消息通知
- [ ] 微信模板消息集成
- [ ] 订单状态通知
- [ ] 支付成功通知
- [ ] 发货通知
- [ ] 营销通知
- [ ] 消息模板管理

**关键接口：**
```
POST   /api/notification/send  # 发送通知
POST   /api/admin/templates    # 创建模板（后台）
```

**验收标准：**
- ✅ 会员等级正常升级
- ✅ 积分正常获取和消费
- ✅ 消息通知正常发送

---

### 第五阶段：管理后台（2 周）

**目标：** 完成管理后台功能

#### Week 12: 基础管理功能
- [ ] 管理员登录
- [ ] 商品管理（CRUD）
- [ ] 订单管理（列表、详情、发货、退款）
- [ ] 用户管理（列表、详情、封禁）
- [ ] 分类管理（CRUD）

#### Week 13: 营销与统计
- [ ] 营销活动管理
- [ ] 优惠券管理
- [ ] 数据统计（订单、销售、用户）
- [ ] 系统配置
- [ ] 日志查询

**关键接口：**
```
POST   /api/admin/login                    # 管理员登录
GET    /api/admin/products                 # 商品列表
POST   /api/admin/products                 # 添加商品
GET    /api/admin/orders                   # 订单列表
PUT    /api/admin/orders/:id/ship          # 订单发货
GET    /api/admin/statistics/overview      # 总览统计
GET    /api/admin/statistics/orders        # 订单统计
GET    /api/admin/statistics/sales         # 销售统计
```

**验收标准：**
- ✅ 管理员可以正常登录
- ✅ 可以管理商品和订单
- ✅ 可以查看统计数据

---

### 第六阶段：优化与测试（1-2 周）

**目标：** 性能优化、安全加固、测试覆盖

#### Week 14: 性能优化
- [ ] Redis 缓存实现
- [ ] 数据库索引优化
- [ ] 查询优化
- [ ] API 响应时间优化
- [ ] 压力测试
- [ ] 性能瓶颈分析

#### Week 15: 安全与测试
- [ ] 接口限流
- [ ] SQL 注入防护
- [ ] XSS 防护
- [ ] 单元测试
- [ ] 集成测试
- [ ] 安全漏洞扫描

**验收标准：**
- ✅ API 响应时间 < 500ms
- ✅ QPS 达到预期
- ✅ 测试覆盖率 > 80%
- ✅ 无安全漏洞

---

### 第七阶段：部署与文档（1 周）

**目标：** 部署配置、文档完善

#### Week 16
- [ ] Docker 配置
- [ ] Docker Compose 编排
- [ ] CI/CD 流程配置
- [ ] 生产环境配置
- [ ] API 文档完善
- [ ] 部署文档编写
- [ ] 运维文档编写

**验收标准：**
- ✅ 可以一键部署
- ✅ 文档完整清晰
- ✅ 生产环境稳定运行

---

## 🎯 里程碑

| 里程碑 | 时间 | 目标 |
|--------|------|------|
| M1 | Week 2 | 基础架构搭建完成 |
| M2 | Week 6 | 核心功能完成，可以下单支付 |
| M3 | Week 9 | 营销功能完成 |
| M4 | Week 11 | 会员与通知完成 |
| M5 | Week 13 | 管理后台完成 |
| M6 | Week 15 | 优化测试完成 |
| M7 | Week 16 | 部署上线 |

---

## 📊 风险管理

### 技术风险
- **风险：** 微信支付对接复杂
  - **应对：** 提前研读文档，参考官方示例

- **风险：** 秒杀高并发处理
  - **应对：** 充分测试，预留优化时间

### 进度风险
- **风险：** 需求变更
  - **应对：** 敏捷开发，小步快跑

- **风险：** 技术难点卡顿
  - **应对：** 提前调研，寻求社区帮助

---

## 📝 后续规划

### Phase 2: 功能扩展
- [ ] 多商户支持
- [ ] 社区功能（评价、问答）
- [ ] 直播带货
- [ ] 积分商城
- [ ] 会员卡

### Phase 3: 性能优化
- [ ] 微服务拆分
- [ ] 读写分离
- [ ] 分库分表
- [ ] CDN 加速
- [ ] 全站缓存

### Phase 4: 数据分析
- [ ] 用户行为分析
- [ ] 商品推荐算法
- [ ] 销售预测
- [ ] 精准营销

---

*开发计划会根据实际情况动态调整*
