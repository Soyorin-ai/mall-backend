## 1. 用户系统扩展 - H5 端认证支持

### 新增功能
除了原有的微信小程序登录，新增以下 H5 端认证方式：

#### H5 端登录方式

1. **账号密码登录**
   - 用户名 + 密码登录
   - 密码使用 BCrypt 加密存储
   - 登录失败限制

2. **手机验证码登录**
   - 手机号 + 验证码登录
   - 验证码固定为 `8808`（开发阶段）
   - 验证码过期时间：5 分钟
   - 用户不存在时自动注册

3. **微信登录**（原有功能）
   - 微信小程序授权登录
   - 微信手机号快速登录

### 用户表结构更新

#### users 表新增字段
```sql
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
  last_login_at: TIMESTAMP            -- 最后登录时间（新增）
)
```

### 认证系统架构

#### 认证服务 (AuthService)

1. **loginByPassword(username, password)**
   - 验证用户名和密码
   - 使用 BCrypt 比对密码
   - 检查用户状态
   - 更新最后登录时间
   - 生成 Access Token 和 Refresh Token

2. **loginByPhone(phone, code)**
   - 验证验证码（固定 8808）
   - 查找用户，不存在则自动注册
   - 更新最后登录时间
   - 生成 Access Token 和 Refresh Token

3. **loginByWechat(code)**
   - 通过微信授权码获取用户信息
   - 查找用户，不存在则自动注册
   - 更新用户信息
   - 生成 Access Token 和 Refresh Token

4. **refreshToken(refreshToken)**
   - 验证 Refresh Token
   - 生成新的 Access Token 和 Refresh Token

5. **validateUser(payload)**
   - JWT 策略调用
   - 验证用户是否存在
   - 检查用户状态

### API 接口设计

#### 认证接口 (AuthController)

所有登录接口使用 `@Public()` 装饰器，不需要 JWT 认证。

1. **POST /auth/login/password** - 账号密码登录
   ```typescript
   {
     username: string,
     password: string
   }
   ```

2. **POST /auth/login/phone** - 手机验证码登录
   ```typescript
   {
     phone: string,
     code: "8808"  // 固定验证码
   }
   ```

3. **POST /auth/login/wechat** - 微信登录
   ```typescript
   {
     code: string  // 微信授权码
   }
   ```

4. **POST /auth/refresh** - 刷新 Token
   ```typescript
   {
     refreshToken: string
   }
   ```

### 安全设计

1. **密码安全**
   - 密码使用 BCrypt 加密存储
   - 登录失败次数限制（可选）
   - 密码强度验证（可选）

2. **验证码安全**
   - 验证码 5 分钟过期
   - 同一手机号验证码限制（生产环境）
   - 验证码错误次数限制（生产环境）

3. **Token 安全**
   - Access Token 有效期：2 小时
   - Refresh Token 有效期：7 天
   - Token 存储在 Redis，支持主动失效
   - Token 刷新时生成新的 Refresh Token（可选）

### 数据验证

#### DTO 设计

1. **LoginByPasswordDto**
   - username: string (必填，3-20 个字符）
   - password: string (必填，6-20 个字符)

2. **LoginByPhoneDto**
   - phone: string (必填，11 位手机号)
   - code: string (必填，必须为 "8808"）

3. **LoginByWechatDto**
   - code: string (必填，微信授权码）

4. **LoginResponseDto**
   - accessToken: string
   - refreshToken: string
   - user: UserInfoDto

5. **UserInfoDto**
   - id: string
   - username: string
   - nickname: string
   - avatar: string
   - phone: string
   - level: number
   - points: number

### 前端对接说明

#### H5 端
1. **账号密码登录**
   - 用户输入用户名和密码
   - 调用 POST /auth/login/password
   - 收到 Access Token 和 Refresh Token
   - 后续请求在 Header 中携带 Access Token

2. **手机验证码登录**
   - 用户输入手机号和验证码（8808）
   - 调用 POST /auth/login/phone
   - 收到 Access Token 和 Refresh Token
   - 如果用户不存在，自动注册
   - 后续请求在 Header 中携带 Access Token

3. **Token 刷新**
   - Access Token 过期后，调用 POST /auth/refresh
   - 使用 Refresh Token 获取新的 Access Token
   - 更新本地存储的 Token

#### 微信小程序端
1. **微信登录**
   - 调用 wx.login() 获取 code
   - 调用 POST /auth/login/wechat
   - 收到 Access Token 和 Refresh Token
   - 后续请求在 Header 中携带 Access Token

---

## 📦 项目目录结构更新

```
wechat-miniprogram-mall/
├── src/
│   ├── main.ts                          # 应用入口
│   ├── app.module.ts                    # 根模块
│   ├── common/                          # 公共模块
│   │   ├── decorators/                  # 装饰器
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts      # 新增：公开接口装饰器
│   │   ├── filters/                     # 异常过滤器
│   │   ├── guards/                      # 守卫
│   │   │   ├── auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── jwt-auth.guard.ts      # 新增：JWT 认证守卫
│   │   ├── interceptors/                # 拦截器
│   │   ├── pipes/                       # 管道
│   │   ├── dtos/                        # 公共 DTO
│   │   ├── utils/                       # 工具类
│   │   └── constants/                   # 常量
│   ├── config/                          # 配置模块
│   └── modules/                         # 业务模块
│       ├── auth/                        # 认证模块（扩展）
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/                # 策略
│       │   │   ├── jwt.strategy.ts       # JWT 认证策略
│       │   │   └── wechat.strategy.ts    # 微信登录策略（待实现）
│       │   ├── guards/                    # 守卫
│       │   │   └── jwt-auth.guard.ts    # JWT 认证守卫
│       │   └── dtos/
│       │       ├── auth.dto.ts          # 认证 DTO（扩展）
│       │       │   - LoginByPasswordDto  # 新增：账号密码登录
│       │       │   - LoginByPhoneDto      # 新增：手机验证码登录
│       │       │   - LoginByWechatDto    # 微信登录
│       │       │   - LoginResponseDto
│       │       │   - RefreshTokenDto
│       │       │   └── UserInfoDto
│       └── user/                        # 用户模块
│           ├── user.module.ts
│           └── entities/
│               └── user.entity.ts      # 用户实体（扩展）
```

---

## 🔄 更新日志

### 2025-02-16 更新
- **H5 端认证支持**
  - 新增账号密码登录
  - 新增手机验证码登录（验证码固定 8808）
  - 扩展用户表，添加 username、password、login_type 字段
  - 新增 JWT 认证守卫
  - 新增公开接口装饰器
  - 完善认证服务和控制器

---

*H5 端认证功能已添加到架构文档中*
