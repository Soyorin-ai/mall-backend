-- PostgreSQL 初始化脚本
-- 为微信小程序商城创建必要的扩展和初始数据

-- 创建 uuid-ossp 扩展（用于生成 UUID）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 pgcrypto 扩展（用于密码加密）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 授予 postgres 用户所有权限
GRANT ALL PRIVILEGES ON DATABASE wechat_mall TO postgres;

-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL 初始化完成！';
    RAISE NOTICE '数据库: wechat_mall';
    RAISE NOTICE '已安装扩展: uuid-ossp, pgcrypto';
END $$;
