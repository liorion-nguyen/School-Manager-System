import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationCode, VerificationCodeSchema } from './entities/verificationCode.entities';
import { VerificationCodeService } from './verificationCode.service';
import { VerificationCodeController } from './verificationCode.controller';
import { UserModule } from 'src/user/user.module'; // Import UserModule để sử dụng UserService

@Module({
  imports: [
    UserModule, 
    MongooseModule.forFeature([{ name: VerificationCode.name, schema: VerificationCodeSchema }]),
  ],
  providers: [VerificationCodeService], 
  controllers: [VerificationCodeController],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
