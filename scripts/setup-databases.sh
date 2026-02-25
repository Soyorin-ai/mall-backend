#!/bin/bash

################################################################################
# 微信小程序商城后端 - 数据库一键安装脚本
# 
# 功能：使用 Docker Compose 安装和启动所有必需的数据库服务
# 作者：Soyorin (长崎素世)
# 日期：2026-02-16
################################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logo
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     __          __  _     _____            _                  ║
║     \ \        / / | |   |  __ \          | |                 ║
║      \ \  /\  / /__| |__ | |__) |___  __ _| |_ ___  _ __      ║
║       \ \/  \/ / _ \ '_ \|  _  // _ \/ _` | __/ _ \| '__|     ║
║        \  /\  /  __/ |_) | | \ \  __/ (_| | || (_) | |        ║
║         \/  \/ \___|_.__/|_|  \_\___|\__,_|\__\___/|_|        ║
║                                                               ║
║            Mall Backend - Database Setup Script               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 切换到项目根目录
cd "$PROJECT_ROOT"

echo -e "${CYAN}[*] 项目目录: ${PROJECT_ROOT}${NC}"
echo ""

# 检查 Docker 是否安装
echo -e "${YELLOW}[1/6] 检查 Docker 环境...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[✗] Docker 未安装！${NC}"
    echo -e "${YELLOW}    请先安装 Docker: https://docs.docker.com/engine/install/${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] Docker 已安装: $(docker --version)${NC}"

# 检查 Docker Compose 是否可用
echo -e "${YELLOW}[2/6] 检查 Docker Compose...${NC}"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo -e "${GREEN}[✓] Docker Compose 已安装: $(docker compose version)${NC}"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}[✓] Docker Compose 已安装: $(docker-compose --version)${NC}"
else
    echo -e "${RED}[✗] Docker Compose 未安装！${NC}"
    echo -e "${YELLOW}    请安装 Docker Compose Plugin 或 docker-compose${NC}"
    exit 1
fi

# 检查 Docker 服务是否运行
echo -e "${YELLOW}[3/6] 检查 Docker 服务状态...${NC}"
if ! docker info &> /dev/null; then
    echo -e "${RED}[✗] Docker 服务未运行！${NC}"
    echo -e "${YELLOW}    请启动 Docker 服务: sudo systemctl start docker${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] Docker 服务运行正常${NC}"

# 检查 docker-compose.yml 文件
echo -e "${YELLOW}[4/6] 检查配置文件...${NC}"
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}[✗] docker-compose.yml 文件不存在！${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] docker-compose.yml 配置文件存在${NC}"

# 询问是否安装可选服务
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}可选服务安装${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo ""

# Elasticsearch
read -p "$(echo -e ${CYAN}[?] 是否安装 Elasticsearch? \(用于商品搜索，推荐\) [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    PROFILES="elasticsearch"
    INSTALL_ES=true
    echo -e "${GREEN}[✓] 将安装 Elasticsearch${NC}"
else
    INSTALL_ES=false
    echo -e "${YELLOW}[!] 跳过 Elasticsearch 安装${NC}"
fi

# 管理工具
read -p "$(echo -e ${CYAN}[?] 是否安装数据库管理工具? \(Redis Commander + Mongo Express\) [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -n "$PROFILES" ]; then
        PROFILES="$PROFILES,tools"
    else
        PROFILES="tools"
    fi
    INSTALL_TOOLS=true
    echo -e "${GREEN}[✓] 将安装数据库管理工具${NC}"
else
    INSTALL_TOOLS=false
    echo -e "${YELLOW}[!] 跳过管理工具安装${NC}"
fi

# 拉取镜像并启动服务
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}开始安装数据库服务${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}[5/6] 拉取 Docker 镜像（首次运行可能需要几分钟）...${NC}"
$COMPOSE_CMD pull

echo ""
echo -e "${YELLOW}[6/6] 启动数据库服务...${NC}"
# 使用环境变量 COMPOSE_PROFILES 来兼容旧版 docker-compose
if [ -n "$PROFILES" ]; then
    export COMPOSE_PROFILES="$PROFILES"
fi
$COMPOSE_CMD up -d

# 等待服务启动
echo ""
echo -e "${YELLOW}[*] 等待服务启动...${NC}"
sleep 5

# 检查服务健康状态
echo ""
echo -e "${YELLOW}[*] 检查服务状态...${NC}"

check_service() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker ps --filter "name=wechat_mall_$service" --filter "status=running" | grep -q "wechat_mall_$service"; then
            echo -e "${GREEN}[✓] $service 运行正常${NC}"
            return 0
        fi
        echo -e "${YELLOW}    等待 $service 启动... ($attempt/$max_attempts)${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}[✗] $service 启动失败${NC}"
    return 1
}

check_service "postgres"
check_service "mongodb"
check_service "redis"

if [ "$INSTALL_ES" = true ]; then
    check_service "elasticsearch"
fi

if [ "$INSTALL_TOOLS" = true ]; then
    check_service "redis_commander"
    check_service "mongo_express"
fi

# 显示服务信息
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}✨ 安装完成！${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📦 服务连接信息:${NC}"
echo -e "${GREEN}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│ PostgreSQL                                          │${NC}"
echo -e "${GREEN}│   Host: localhost:5432                              │${NC}"
echo -e "${GREEN}│   Database: wechat_mall                             │${NC}"
echo -e "${GREEN}│   Username: postgres                                │${NC}"
echo -e "${GREEN}│   Password: postgres123                             │${NC}"
echo -e "${GREEN}├─────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│ MongoDB                                             │${NC}"
echo -e "${GREEN}│   Host: localhost:27017                             │${NC}"
echo -e "${GREEN}│   Database: wechat_mall                             │${NC}"
echo -e "${GREEN}│   Username: admin                                   │${NC}"
echo -e "${GREEN}│   Password: mongo123                                │${NC}"
echo -e "${GREEN}│   URI: mongodb://admin:mongo123@localhost:27017     │${NC}"
echo -e "${GREEN}├─────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│ Redis                                               │${NC}"
echo -e "${GREEN}│   Host: localhost:6379                              │${NC}"
echo -e "${GREEN}│   Password: redis123                                │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────────────┘${NC}"

if [ "$INSTALL_ES" = true ]; then
    echo -e "${GREEN}┌─────────────────────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│ Elasticsearch                                        │${NC}"
    echo -e "${GREEN}│   Host: http://localhost:9200                       │${NC}"
    echo -e "${GREEN}│   Username: (无)                                    │${NC}"
    echo -e "${GREEN}│   Password: (无)                                    │${NC}"
    echo -e "${GREEN}└─────────────────────────────────────────────────────┘${NC}"
fi

if [ "$INSTALL_TOOLS" = true ]; then
    echo ""
    echo -e "${CYAN}🔧 管理工具:${NC}"
    echo -e "${GREEN}┌─────────────────────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│ Redis Commander (Redis 管理界面)                    │${NC}"
    echo -e "${GREEN}│   URL: http://localhost:8081                        │${NC}"
    echo -e "${GREEN}├─────────────────────────────────────────────────────┤${NC}"
    echo -e "${GREEN}│ Mongo Express (MongoDB 管理界面)                    │${NC}"
    echo -e "${GREEN}│   URL: http://localhost:8082                        │${NC}"
    echo -e "${GREEN}│   Username: admin                                   │${NC}"
    echo -e "${GREEN}│   Password: admin123                                │${NC}"
    echo -e "${GREEN}└─────────────────────────────────────────────────────┘${NC}"
fi

# 生成 .env 文件配置
echo ""
echo -e "${CYAN}📝 更新 .env 文件配置...${NC}"
if [ -f ".env" ]; then
    # 备份原文件
    cp .env .env.backup.$(date +%Y%m%d%H%M%S)
    echo -e "${YELLOW}[*] 已备份原 .env 文件${NC}"
    
    # 更新数据库配置
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=postgres123/' .env
    sed -i 's|^MONGODB_URI=.*|MONGODB_URI=mongodb://admin:mongo123@localhost:27017/wechat_mall|' .env
    sed -i 's/^REDIS_PASSWORD=.*/REDIS_PASSWORD=redis123/' .env
    
    if [ "$INSTALL_ES" = true ]; then
        sed -i 's|^ELASTICSEARCH_NODE=.*|ELASTICSEARCH_NODE=http://localhost:9200|' .env
    fi
    
    echo -e "${GREEN}[✓] .env 文件已更新${NC}"
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=postgres123/' .env
        sed -i 's|^MONGODB_URI=.*|MONGODB_URI=mongodb://admin:mongo123@localhost:27017/wechat_mall|' .env
        sed -i 's/^REDIS_PASSWORD=.*/REDIS_PASSWORD=redis123/' .env
        
        if [ "$INSTALL_ES" = true ]; then
            sed -i 's|^ELASTICSEARCH_NODE=.*|ELASTICSEARCH_NODE=http://localhost:9200|' .env
        fi
        
        echo -e "${GREEN}[✓] 已创建 .env 文件并配置${NC}"
    fi
fi

# 显示常用命令
echo ""
echo -e "${CYAN}📚 常用命令:${NC}"
echo -e "${YELLOW}  查看服务状态:${NC}"
echo -e "    $COMPOSE_CMD ps"
echo ""
echo -e "${YELLOW}  查看服务日志:${NC}"
echo -e "    $COMPOSE_CMD logs -f [服务名]"
echo ""
echo -e "${YELLOW}  停止所有服务:${NC}"
echo -e "    $COMPOSE_CMD down"
echo ""
echo -e "${YELLOW}  停止并删除数据:${NC}"
echo -e "    $COMPOSE_CMD down -v"
echo ""
echo -e "${YELLOW}  重启所有服务:${NC}"
echo -e "    $COMPOSE_CMD restart"
echo ""

echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ 准备就绪！现在可以运行 npm install && npm run start:dev 启动后端服务了～${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════${NC}"
