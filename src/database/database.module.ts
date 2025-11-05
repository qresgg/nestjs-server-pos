import { Module } from '@nestjs/common';
import { MySqlModule} from "./mysql/mysql.module";
import { MongoModule } from './mongo/mongo.module';

@Module({
    imports: [MySqlModule, MongoModule],
    exports: [MySqlModule, MongoModule],
})
export class DatabaseModule {}
