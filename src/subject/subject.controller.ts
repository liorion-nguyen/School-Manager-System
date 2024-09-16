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
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { SubjectService } from './subject.service';


@Controller('Subjects')
export class SubjectController {
    constructor(
        private subjectService: SubjectService,
    ) { }


    @Get()
    async getAllSubject(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        }
    ): Promise<any> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.subjectService.findSearch(pageOption);
    }

    @Get(':id')
    async getgetSubject(
        @Param('id') id: string,
    ): Promise<any> {
        return this.subjectService.getSubject(id);
    }
    
    @Post()
    async createcreateSubject(@Body() Subject: CreateSubjectDto): Promise<any> {
        return this.subjectService.createSubject(Subject);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() Subject: UpdateSubjectDto): Promise<any> {
        return this.subjectService.updateSubject(id, Subject);
    }

    @Delete(':id')
    async deletedeleteSubject(@Param('id') id: string) 
    {
        return this.subjectService.deleteSubject(id);
    }
}