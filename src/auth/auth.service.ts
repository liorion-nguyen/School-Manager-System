import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { VerificationCodeService } from 'src/verificationCode/verificationCode.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private verificationCodeService: VerificationCodeService,
    private mailerService: MailerService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    let user = await this.userService.findOneUsername(username);
    if (!user) {
      user = await this.userService.findOneEmail(username);
    }
    if (!user) {
      return {
        status: 404,
        description: 'Invalid username or password'
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: 404,
        description: 'Invalid username or password'
      }
    }
    const { password: userPassword, ...userData } = user._doc;
    return userData;
  }

  async generateTokens(user: any) {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.userService.setCurrentRefreshToken(refreshToken, user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp <= currentTime) return {status: 404, description: 'Token has expired.'}
      const data = await this.userService.getUserById(payload.sub);
      const user = data.data;

      if (!user || user.refreshToken !== refreshToken) {
        return {
          status: 404,
          description: 'Invalid refresh token'
        };
      }
      const accessToken = this.jwtService.sign({ username: user.username, sub: user._id }, { expiresIn: '15m' });

      return {
        status: 201,
        data: accessToken
      };
    } catch (e) {
      return {
        status: 401,
        description: 'Invalid refresh token'
      };
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneEmail(email);
    if (!user) {
      return {
        status: 404,
        description: "User not found."
      };
    }

    const code = await this.verificationCodeService.generateCode(user._id);

    const sendEmail = await this.mailerService.sendEmail({
      email: email,
      content: `Your verification code is: ${code} in 5 minutes.`
    });

    if (sendEmail.status === 200) {
      return {
        status: 200,
        description: "Verification code sent to email."
      };
    } else {
      return {
        status: 404,
        description: "Failed to send email."
      };
    }
  }
}
