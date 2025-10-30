import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {StaffService} from "../staff/staff.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {CreateStaffDto} from "../staff/dto/create-staff.dto";
import {AuthDto} from "./dto/auth.dto";
import argon2 = require("argon2");
import { StaffDto } from "../staff/dto/staff.dto";
import {Staff} from "../staff/entities/staff.entity";

@Injectable()
export class AuthService {
  constructor(
      private staffService: StaffService,
      private jwtService: JwtService,
      private configService: ConfigService,
  ) {}
    // async singUp(createStaffDto: CreateStaffDto): Promise<any>{
    //   const staffExists = await this.staffService.findByCode(createStaffDto.code);
    //   if (staffExists) throw new BadRequestException(' already exists');
    // }

    async signIn(data: AuthDto){
      const { code } = data;

      const employee  = await this.staffService.findByCode(code);
      console.log(employee);
      if (!employee) throw new BadRequestException('Employee not found!');

      const tokens = await this.getTokens(employee.id, employee.code);
      await this.updateRefreshToken(employee.id, tokens.refreshToken);

      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, employee };
    }

    async logout(staffId: string){
      return this.staffService.update(staffId, { refreshHash: null});
    }

    hashData(data: string){
      return argon2.hash(data);
    }

    async updateRefreshToken(staffId: string, refreshToken: string):Promise<any>{
      const hashedRefreshToken = await this.hashData(refreshToken);
      console.log(hashedRefreshToken)
      console.log(staffId);
      return await this.staffService.update(staffId, {
          refreshHash: hashedRefreshToken
      });
    }

    async getTokens(staffId: string, code: string){
      const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
              {
                  sub: staffId,
                  code
              },
              {
                  secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                  expiresIn: '15m',
              }
          ),
          this.jwtService.signAsync(
              {
                  sub: staffId,
                  code
              },
              {
                  secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                  expiresIn: '15h'
              }
          )
      ]);
      return {
          accessToken,
          refreshToken,
      }
    }
}
