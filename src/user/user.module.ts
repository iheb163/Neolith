import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Ajout du module TypeORM avec l'entité User
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Optionnel : pour que AuthService puisse utiliser UserService
})
export class UserModule {}
