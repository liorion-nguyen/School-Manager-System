import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { VerificationCode, VerificationCodeDocument } from './entities/verificationCode.entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectModel(VerificationCode.name) private verificationCodeModel: Model<VerificationCodeDocument>,
    private userService: UserService
  ) { }

  async generateCode(userId: string): Promise<string> {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const existingCode = await this.verificationCodeModel.findOne({ userId });

    if (existingCode) {
      await this.verificationCodeModel.findByIdAndUpdate(existingCode._id, {
        code,
        expiresAt,
      }, {
        new: true,
        runValidators: true,
      });
    } else {
      await this.verificationCodeModel.create({
        userId,
        code,
        expiresAt,
      });
    }

    return code;
  }

  async verifyCode(email: string, code: string): Promise<any> {
    const user = await this.userService.findOneEmail(email);
    const userId = user._id;
    
    const record = await this.verificationCodeModel.findOne({ userId, code }).exec();

    if (!record) {
      return {
        status: 400,
        message: "The code was wrong"
      }
    }

    if (record.expiresAt < new Date()) {
      await this.verificationCodeModel.deleteOne({ _id: record._id }).exec();
      return {
        status: 400,
        message: "The code has expired"
      }
    }

    await this.verificationCodeModel.deleteOne({ _id: record._id }).exec();
    return {
      status: 200,
      message: "The code is correct"
    }
  }

  async clearCodes(userId: string): Promise<void> {
    await this.verificationCodeModel.deleteMany({ userId }).exec();
  }
}
