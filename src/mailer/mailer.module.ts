import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { UserSchema } from 'src/user/entities/user.entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService], 
})
export class MailerModule {}
