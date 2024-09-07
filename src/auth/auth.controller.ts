import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<any> {
        const user = req.user;
        if (user.isActive) {
            const tokens = await this.authService.generateTokens(user);
            return { status: 201, data: { ...tokens, user }, description: "Log in successfully." };
        } else {
            return {
                status: 401,
                description: "Account or password is incorrect."
            }
        }
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshToken: any) {
        if (!refreshToken) {
            return {
                status: 401,
                description: "Refresh token is required"
            }
        }
        return this.authService.refreshToken(refreshToken.refreshToken);
    }

    @Post('forgotpassword/email')
    async forgotPassword(@Body('email') email: string): Promise<any> {
        return this.authService.forgotPassword(email);
    }
}
