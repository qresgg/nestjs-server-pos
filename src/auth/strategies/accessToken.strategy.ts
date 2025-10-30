import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import type { JwtPayload} from "../types/jwt.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private readonly configService: ConfigService,
    ) {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}