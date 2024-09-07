import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { VerificationCodeModule } from 'src/verificationCode/verification.module';

@Module({
  imports: [
    UserModule,
    VerificationCodeModule,
    MailerModule, 
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
