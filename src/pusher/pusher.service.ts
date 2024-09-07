import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: "1855142",
      key: "ec6db52e2779d8691217",
      secret: "17a823758aec286e5e59",
      cluster: "ap1",
      useTLS: true,
    });
  }

  async triggerEvent(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
