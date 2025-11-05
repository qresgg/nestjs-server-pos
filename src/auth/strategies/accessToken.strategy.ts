import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import type { JwtPayload} from "../types/jwt.type";
import {StaffService} from "../../staff/staff.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private readonly configService: ConfigService,
        private staffService: StaffService,
    ) {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    validate(payload: JwtPayload) {
        // const user = await this.staffService.findOne(payload.sub);
        // if (!user) return null;
        // return {
        //     id: user.id,
        //     email: user.email,
        //     role: user.role,
        // };
        return payload;
    }
}