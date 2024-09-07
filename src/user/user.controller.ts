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
import { UserService } from './user.service';
import { User } from './entities/user.entities';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';


@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) { }


    @Get()
    async getAllUser(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        }
    ): Promise<{ data: User[], count: number }> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.userService.getAllUser(pageOption);
    }

    @Get("/search")
    async findSearch( @Query() pageOption: {
      page?: number,
      show?: number,
      search?: string,
    }): Promise<{ data: User[], count: number }> {
      return this.userService.findSearch(pageOption);
    }

    @Get("/cccd/:id")
    async findCCCD(@Param('id') id: string): Promise<any> {
      return this.userService.findCCCD(id);
    }

    @Get("/profileImage/:id")
    async findProfileImage(@Param('id') id: string): Promise<any> {
      return this.userService.findProfileImage(id);
    }

    @Get(':id')
    async getUser(
        @Param('id') id: string,
    ): Promise<User> {
        return this.userService.getUser(id);
    }
    
    @Post()
    async createUser(@Body() user: CreateUserDto): Promise<User> {
        return this.userService.createUser(user);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, user);
    }

    @Delete(':id')
    async deleteUser(
        @Param('id')
        id: string,
    ) {
        return this.userService.deleteUser(id);
    }

    @Post('updatePassword')
    async updatePassword(@Body('email') email: string, @Body('password') password: string): Promise<any> {
        return this.userService.updatePassword(email, password);
    }
}