import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { Student, StudentSchema } from "./entities/student.entities";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    forwardRef(() => UserModule),
    // UserModule
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService, MongooseModule],
})
export class StudentModule {}