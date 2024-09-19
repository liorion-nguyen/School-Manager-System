import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { PusherModule } from './pusher/pusher.module';
import { PusherService } from './pusher/pusher.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { VerificationCodeModule } from './verificationCode/verification.module';
import { PermissionModule } from './permission/permission.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectModule } from './subject/subject.module';
import { StudentModule } from './student/student.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    MailerModule,
    PusherModule,
    AuthModule,
    FirebaseModule,
    PermissionModule,
    VerificationCodeModule,
    TeacherModule,
    StudentModule,
    ClassesModule,
    SubjectModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PusherService],
})
export class AppModule { }
