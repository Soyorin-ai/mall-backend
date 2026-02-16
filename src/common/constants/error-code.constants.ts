/**
 * 错误码常量
 */
export enum ErrorCode {
  // 通用错误 (1000-1999)
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,

  // 认证错误 (2000-2999)
  AUTH_INVALID_TOKEN = 2001,
  AUTH_TOKEN_EXPIRED = 2002,
  AUTH_INVALID_CREDENTIALS = 2003,

  // 用户错误 (3000-3999)
  USER_NOT_FOUND = 3001,
  USER_ALREADY_EXISTS = 3002,
  USER_PHONE_ALREADY_EXISTS = 3003,
  USER_DISABLED = 3004,

  // 商品错误 (4000-4999)
  PRODUCT_NOT_FOUND = 4001,
  PRODUCT_SKU_NOT_FOUND = 4002,
  PRODUCT_OUT_OF_STOCK = 4003,
  PRODUCT_SOLD_OUT = 4004,

  // 订单错误 (5000-5999)
  ORDER_NOT_FOUND = 5001,
  ORDER_STATUS_INVALID = 5002,
  ORDER_CANNOT_CANCEL = 5003,
  ORDER_CANNOT_REFUND = 5004,

  // 支付错误 (6000-6999)
  PAYMENT_FAILED = 6001,
  PAYMENT_TIMEOUT = 6002,
  PAYMENT_ALREADY_PAID = 6003,
  PAYMENT_REFUND_FAILED = 6004,

  // 优惠券错误 (7000-7999)
  COUPON_NOT_FOUND = 7001,
  COUPON_EXPIRED = 7002,
  COUPON_NOT_AVAILABLE = 7003,
  COUPON_REACHED_LIMIT = 7004,
  COUPON_ALREADY_USED = 7005,
}

export const ERROR_MESSAGES = {
  [ErrorCode.SUCCESS]: '操作成功',
  [ErrorCode.BAD_REQUEST]: '参数错误',
  [ErrorCode.UNAUTHORIZED]: '未登录',
  [ErrorCode.FORBIDDEN]: '无权限',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器错误',

  [ErrorCode.AUTH_INVALID_TOKEN]: 'Token 无效',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Token 已过期',
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: '用户名或密码错误',

  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ErrorCode.USER_PHONE_ALREADY_EXISTS]: '手机号已注册',
  [ErrorCode.USER_DISABLED]: '用户已被禁用',

  [ErrorCode.PRODUCT_NOT_FOUND]: '商品不存在',
  [ErrorCode.PRODUCT_SKU_NOT_FOUND]: '商品规格不存在',
  [ErrorCode.PRODUCT_OUT_OF_STOCK]: '库存不足',
  [ErrorCode.PRODUCT_SOLD_OUT]: '商品已售罄',

  [ErrorCode.ORDER_NOT_FOUND]: '订单不存在',
  [ErrorCode.ORDER_STATUS_INVALID]: '订单状态错误',
  [ErrorCode.ORDER_CANNOT_CANCEL]: '订单无法取消',
  [ErrorCode.ORDER_CANNOT_REFUND]: '订单无法退款',

  [ErrorCode.PAYMENT_FAILED]: '支付失败',
  [ErrorCode.PAYMENT_TIMEOUT]: '支付超时',
  [ErrorCode.PAYMENT_ALREADY_PAID]: '订单已支付',
  [ErrorCode.PAYMENT_REFUND_FAILED]: '退款失败',

  [ErrorCode.COUPON_NOT_FOUND]: '优惠券不存在',
  [ErrorCode.COUPON_EXPIRED]: '优惠券已过期',
  [ErrorCode.COUPON_NOT_AVAILABLE]: '优惠券不可用',
  [ErrorCode.COUPON_REACHED_LIMIT]: '优惠券已达领取上限',
  [ErrorCode.COUPON_ALREADY_USED]: '优惠券已使用',
};
