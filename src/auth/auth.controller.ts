import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import express_1 from 'express';
import {AuthService} from './auth.service';
import {CreateAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {AuthDto} from "./dto/auth.dto";
import express from 'express';
import {buildOriginEmployee} from "./utils/repsonseTemplates";
import {RefreshAuthGuard} from "./guard/refresh-auth.guard";
import {AccessAuthGuard} from "./guard/access-auth.guard";

interface AuthRequest extends Request {
    user: {
        sub: string;
        code: string;
    }
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    async updateAccessToken(@Req() req, @Res() res) {
        const user = req.user;
        const accessToken = await this.authService.updateAccessToken(user.sub, user.refreshToken);
        return res.json(accessToken);
    }

    @Get('me')
    @UseGuards(AccessAuthGuard)
    getProfile(@Req() req) {

    }


    //@Post()
    // create(@Body() createAuthDto: CreateAuthDto) {
    //   return this.authService.signUp(createAuthDto);
    // }

    @Post('signIn')
    async signIn(@Body() data: AuthDto, @Res() res: express_1.Response) {
        const result = await this.authService.signIn(data);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'production',
            sameSite: "strict",
            maxAge: 15*60*60*1000
        });
        res.status(200).json({
            employee: buildOriginEmployee(result.employee),
            accessToken: result.accessToken,
        })
    }

    @Post('logout')
    logout(@Req() req: AuthRequest){
      this.authService.logout(req.user.sub)
        return { message: 'Logged out' }
  }
}
