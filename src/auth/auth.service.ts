import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
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

      return { accessToken: tokens.accessToken, employee, refreshToken: tokens.refreshToken };
    }

    async logout(staffId: string){
      return this.staffService.update(staffId, { refreshHash: null});
    }

    async hashData(data: string){
      return await argon2.hash(data);
    }

    async refreshTokens(staffId: number, refreshToken: string, res: Response) {
        const employee = await this.staffService.findById(String(staffId));
        if (!employee) throw new BadRequestException('Employee not found!');
        const refreshTokensMatches = await argon2.verify(<string>employee?.refreshHash, refreshToken);
        if (!refreshTokensMatches) throw new BadRequestException('Refresh token not found');

        const tokens = await this.getTokens(employee.id, employee.code);
        await this.updateRefreshToken(employee.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
        return {
            accessToken: tokens.accessToken
        }
    }

    async updateRefreshToken(staffId: string, refreshToken: string):Promise<any>{
      const hashedRefreshToken = await this.hashData(refreshToken);
      console.log(hashedRefreshToken)
      console.log(staffId);
      await this.staffService.update(staffId, {
          refreshHash: hashedRefreshToken
      });
    }

    async updateAccessToken(staffId: string, refreshToken: string):Promise<any>{
      console.log('at')
      const staff = await this.staffService.findById(String(staffId));
      if (!staff) throw new BadRequestException('Employee not found!');
        if (typeof staff.refreshHash === "string") {
            const isValid = await argon2.verify(staff.refreshHash, refreshToken);
            if (!isValid) throw new BadRequestException('Refresh token not found');
        }
        const accessToken = await this.jwtService.signAsync(
            { sub: staff.id, code: staff.code },
            { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }
        );
        console.log('tried to update accessToken', accessToken);
        return accessToken;
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
