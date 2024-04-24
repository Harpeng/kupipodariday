import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { DatabaseConfigFactory } from './config/db.config';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashModule,
    AuthModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: DatabaseConfigFactory,
    }),
  ],
  providers: [],
})
export class AppModule {}
