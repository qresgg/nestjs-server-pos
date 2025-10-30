import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { StaffModule } from './staff/staff.module';
import { Staff } from './staff/entities/staff.entity';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Staff],
          synchronize: true,
      }),
      StaffModule,
      AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}