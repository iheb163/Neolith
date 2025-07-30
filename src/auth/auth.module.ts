import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,  // <-- on importe ici le module qui exporte UserService
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
