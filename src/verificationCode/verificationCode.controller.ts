import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VerificationCodeService } from './verificationCode.service';

@Controller('verification-code')
export class VerificationCodeController {
  constructor(private readonly verificationCodeService: VerificationCodeService) {}

  @Post('generate/:userId')
  async generateCode(@Param('userId') userId: string) {
    const code = await this.verificationCodeService.generateCode(userId);
    return { code };
  }

  @Post('verify')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    return await this.verificationCodeService.verifyCode(email, code);
  }
}