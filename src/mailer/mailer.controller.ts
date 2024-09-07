import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import internal from 'stream';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) { }

    @Post()
    async sendEmail(@Body() data: any) {
        return this.mailerService.sendEmail(data);
    }
}