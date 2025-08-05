// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // prend le token depuis Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret_key', // change le secret selon ton .env
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
