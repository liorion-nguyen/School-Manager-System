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
import { CreateClassesDto, UpdateClassesDto } from './dto/classes.dto';
import { ClassesService } from './classes.service';


@Controller('classes')
export class ClassesController {
    constructor(
        private classesService: ClassesService,
    ) { }


    @Get()
    async getAllClasses(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        }
    ): Promise<any> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.classesService.findSearch(pageOption);
    }

    @Get(':id')
    async getgetClasses(
        @Param('id') id: string,
    ): Promise<any> {
        return this.classesService.getClasses(id);
    }
    
    @Post()
    async createcreateClasses(@Body() Classes: CreateClassesDto): Promise<any> {
        return this.classesService.createClasses(Classes);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() Classes: UpdateClassesDto): Promise<any> {
        return this.classesService.updateClasses(id, Classes);
    }

    @Delete(':id')
    async deletedeleteClasses(@Param('id') id: string) 
    {
        return this.classesService.deleteClasses(id);
    }
}