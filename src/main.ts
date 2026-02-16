import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('微信小程序商城后端')
    .setDescription('基于 NestJS 构建的微信小程序单商户商城后端系统')
    .setVersion('1.0')
    .addTag('auth', '认证')
    .addTag('user', '用户')
    .addTag('product', '商品')
    .addTag('order', '订单')
    .addTag('payment', '支付')
    .addTag('member', '会员')
    .addTag('marketing', '营销')
    .addTag('admin', '管理后台')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api-docs', app, config);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
}
bootstrap();
