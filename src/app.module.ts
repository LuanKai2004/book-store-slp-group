import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './auth/protected/protected.controller';
import { BookModule } from './book/book.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { LogModule } from './log/log.module';
import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ Đặt false khi production
        logging: true,
        driver: require('mysql2'),
        retryAttempts: 3,
        retryDelay: 1000,
        connectTimeout: 20000, // Increase timeout to 20 seconds
      }),
    }),

    BookModule,
    UserModule,
    RoleModule,
    CategoryModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    ReviewModule,
    PaymentModule,
    LogModule,
    AuthModule,
  ],
  controllers: [AppController, ProtectedController],
  providers: [AppService],
})
export class AppModule {}
