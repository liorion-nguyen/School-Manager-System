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
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entities';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';


@Controller('permissions')
export class PermissionController {
    constructor(
        private PermissionService: PermissionService,
    ) { }


    @Get()
    async getAllPermission(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        },
    ): Promise<{ data: Permission[], count: number }> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.PermissionService.getAllPermission(pageOption);
    }

    @Get(':id')
    async getPermission(
        @Param('id') id: string,
    ): Promise<Permission> {
        return this.PermissionService.getPermission(id);
    }
    @Post()
    async createPermission(@Body() Permission: CreatePermissionDto): Promise<Permission> {
        return this.PermissionService.createPermission(Permission);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() Permission: UpdatePermissionDto): Promise<Permission> {
        return this.PermissionService.updatePermission(id, Permission);
    }

    @Delete(':id')
    async deletePermission(
        @Param('id')
        id: string,
    ) {
        return this.PermissionService.deletePermission(id);
    }
}