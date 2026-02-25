// MongoDB 初始化脚本
// 为微信小程序商城创建必要的集合和索引

// 切换到 wechat_mall 数据库
db = db.getSiblingDB('wechat_mall');

// 创建用户集合
db.createCollection('users');
db.users.createIndex({ 'openid': 1 }, { unique: true });
db.users.createIndex({ 'phone': 1 }, { sparse: true });
db.users.createIndex({ 'createdAt': -1 });

// 创建商品浏览记录集合
db.createCollection('product_views');
db.product_views.createIndex({ 'userId': 1, 'productId': 1 });
db.product_views.createIndex({ 'createdAt': -1 });

// 创建用户行为日志集合
db.createCollection('user_behaviors');
db.user_behaviors.createIndex({ 'userId': 1, 'type': 1 });
db.user_behaviors.createIndex({ 'createdAt': -1 });

// 创建搜索历史集合
db.createCollection('search_histories');
db.search_histories.createIndex({ 'userId': 1 });
db.search_histories.createIndex({ 'keyword': 1 });
db.search_histories.createIndex({ 'createdAt': -1 });

// 创建消息通知集合
db.createCollection('notifications');
db.notifications.createIndex({ 'userId': 1, 'read': 1 });
db.notifications.createIndex({ 'createdAt': -1 });

// 创建系统配置集合
db.createCollection('system_configs');
db.system_configs.createIndex({ 'key': 1 }, { unique: true });

// 插入默认系统配置
db.system_configs.insertMany([
    {
        key: 'order_auto_cancel_minutes',
        value: 30,
        description: '订单自动取消时间（分钟）',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        key: 'order_auto_confirm_days',
        value: 7,
        description: '订单自动确认收货时间（天）',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        key: 'freight_free_amount',
        value: 99,
        description: '免运费最低金额（元）',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        key: 'default_freight',
        value: 10,
        description: '默认运费（元）',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

print('MongoDB 初始化完成！');
print('已创建集合: users, product_views, user_behaviors, search_histories, notifications, system_configs');
