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
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { Teacher } from './entities/teacher.entities';
import { TeacherService } from './teacher.service';


@Controller('teachers')
export class TeacherController {
    constructor(
        private teacherService: TeacherService,
    ) { }


    @Get()
    async getAllTeacher(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        }
    ): Promise<any> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.teacherService.findSearch(pageOption);
    }

    @Get(':id')
    async getgetTeacher(
        @Param('id') id: string,
    ): Promise<any> {
        return this.teacherService.getTeacher(id);
    }
    
    @Post()
    async createcreateTeacher(@Body() Teacher: CreateTeacherDto): Promise<any> {
        return this.teacherService.createTeacher(Teacher);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() Teacher: UpdateTeacherDto): Promise<any> {
        return this.teacherService.updateTeacher(id, Teacher);
    }

    @Delete(':id')
    async deletedeleteTeacher(@Param('id') id: string) 
    {
        return this.teacherService.deleteTeacher(id);
    }
}