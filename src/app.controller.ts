import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PusherService } from './pusher/pusher.service'; 

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pusherService: PusherService, 
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('pusher')
  sendNotification(@Body() data: { channel: string; event: string; data: any }) {
    this.pusherService.triggerEvent(data.channel, data.event, data.data);
    return { success: true };
  }
}