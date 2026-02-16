/**
 * Redis Key 常量
 */
export const REDIS_KEYS = {
  // 用户相关
  USER_INFO: (userId: string) => `user:info:${userId}`,
  USER_TOKEN: (userId: string) => `user:token:${userId}`,
  USER_SESSION: (userId: string) => `user:session:${userId}`,

  // 商品相关
  PRODUCT_INFO: (productId: string) => `product:info:${productId}`,
  PRODUCT_SKU_INFO: (skuId: string) => `product:sku:info:${skuId}`,
  PRODUCT_STOCK: (skuId: string) => `product:stock:${skuId}`,
  PRODUCT_LIST: (page: number) => `product:list:${page}`,
  HOT_PRODUCTS: 'product:hot',

  // 分类相关
  CATEGORY_LIST: 'category:list',
  CATEGORY_TREE: 'category:tree',

  // 购物车相关
  CART: (userId: string) => `cart:${userId}`,

  // 订单相关
  ORDER_INFO: (orderId: string) => `order:info:${orderId}`,
  ORDER_LOCK: (orderId: string) => `order:lock:${orderId}`,

  // 优惠券相关
  COUPON_INFO: (couponId: string) => `coupon:info:${couponId}`,
  USER_COUPON: (userId: string, couponId: string) => `user:coupon:${userId}:${couponId}`,
  COUPON_STOCK: (couponId: string) => `coupon:stock:${couponId}`,

  // 秒杀相关
  SECKILL_PRODUCT: (productId: string) => `seckill:product:${productId}`,
  SECKILL_LOCK: (userId: string, productId: string) => `seckill:lock:${userId}:${productId}`,
  SECKILL_STOCK: (skuId: string) => `seckill:stock:${skuId}`,

  // 拼团相关
  GROUP_INFO: (groupId: string) => `group:info:${groupId}`,
  GROUP_MEMBERS: (groupId: string) => `group:members:${groupId}`,

  // 配置相关
  SYSTEM_CONFIG: 'system:config',
  LOGISTICS_COMPANIES: 'logistics:companies',

  // 限流相关
  RATE_LIMIT: (ip: string) => `rate:limit:${ip}`,
  RATE_LIMIT_USER: (userId: string) => `rate:limit:user:${userId}`,
};

export const REDIS_EXPIRE = {
  // 短期缓存（5分钟）
  SHORT: 300,
  // 中期缓存（30分钟）
  MEDIUM: 1800,
  // 长期缓存（2小时）
  LONG: 7200,
  // 超长期缓存（24小时）
  VERY_LONG: 86400,
};
