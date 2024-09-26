import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { Teacher, TeacherSchema } from "./entities/teacher.entities";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    forwardRef(() => UserModule),
    // UserModule
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService, MongooseModule],
})
export class TeacherModule {}