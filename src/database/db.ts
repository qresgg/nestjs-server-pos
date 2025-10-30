// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import {Staff} from "../staff/entities/staff.entity";
//
// @Module({
//
//     imports: [
//         TypeOrmModule.forRoot({
//             type: process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
//             host: process.env.DB_HOST,
//             port: Number(process.env.DB_PORT),
//             username: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
//             entities: [Staff],
//             synchronize: true,
//         }),
//     ],
// })
// export class AppModule {}
