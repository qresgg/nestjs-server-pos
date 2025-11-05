import { InjectionToken, Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessAuthGuard extends AuthGuard('jwt') {}