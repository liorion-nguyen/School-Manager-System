import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Param,
    Delete,
    Query,
    BadRequestException,
    Headers,
} from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Student } from './entities/student.entities';
import { StudentService } from './student.service';


@Controller('students')
export class StudentController {
    constructor(
        private studentService: StudentService,
    ) { }


    @Get()
    async getAllStudent(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        }
    ): Promise<any> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.studentService.findSearch(pageOption);
    }

    @Get(':id')
    async getgetStudent(
        @Param('id') id: string,
    ): Promise<any> {
        return this.studentService.getStudent(id);
    }
    
    @Post()
    async createcreateStudent(@Body() student: CreateStudentDto): Promise<any> {
        return this.studentService.createStudent(student);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() student: UpdateStudentDto): Promise<any> {
        return this.studentService.updateStudent(id, student);
    }

    @Delete(':id')
    async deletedeleteStudent(@Param('id') id: string) 
    {
        return this.studentService.deleteStudent(id);
    }
}