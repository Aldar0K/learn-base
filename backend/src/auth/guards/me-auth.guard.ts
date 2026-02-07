import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class MeAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      const http = context.switchToHttp();
      const req = http.getRequest<Request>();
      const res = http.getResponse<Response>();
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        throw err || new UnauthorizedException("Unauthorized");
      }

      const result = await this.authService.refreshToken(refreshToken);
      const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes

      res.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: accessTokenMaxAge,
        path: "/",
      });

      req.user = result.user;
      return true;
    }
  }

  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    if (user) {
      return user;
    }

    if (err instanceof Error) {
      throw err;
    }

    throw new UnauthorizedException("Unauthorized");
  }
}
