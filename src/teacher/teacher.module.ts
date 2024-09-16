import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { Teacher, TeacherSchema } from "./entities/teacher.entities";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}