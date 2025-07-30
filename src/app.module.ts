import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',        // ton utilisateur PostgreSQL
      password: 'postgrespwd', // remplace par ton mot de passe
      database: 'firstnest',       // 💡 ta base à toi
      autoLoadEntities: true,
      synchronize: true,           // ❗ à désactiver en production
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
