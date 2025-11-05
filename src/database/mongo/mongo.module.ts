import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                uri: config.get('MONGO_DB_URI'),
            }),
            inject: [ConfigService],
        })
    ],
    exports: [MongooseModule]
})
export class MongoModule {}
