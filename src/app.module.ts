import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashModule,
    AuthModule,
  ],
})
export class AppModule {}
