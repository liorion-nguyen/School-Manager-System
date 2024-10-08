import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    Get,
    Query
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
            return { status: 200, data: { ...tokens, user }, description: "Log in successfully." };
        } else {
            return {
                status: 404,
                description: "Account or password is incorrect."
            }
        }
    }

    @Post('test')
    async logintestpost(@Query() pageOption: {
        username?: string,
        password?: string
    }): Promise<any> {
       return this.authService.validateUser(pageOption.username, pageOption.password)
    }

    @Post('test1')
    async test(@Body('email') email: string): Promise<any> {
        return {
            email: email
        };
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshToken: any) {
        if (!refreshToken) {
            return {
                status: 404,
                description: "Refresh token is required"
            }
        }
        return this.authService.refreshToken(refreshToken.refreshToken);
    }

    @Post('forgotpassword')
    async forgotPassword(@Body('email') email: string): Promise<any> {
        return this.authService.forgotPassword(email);
    }
    @Post('confirmcode')
    async confirmCode(@Body('email') email: string, @Body('code') code: string, @Body('password') password: string): Promise<any> {
        return this.authService.confirmCode(email, code, password);
    }
}
