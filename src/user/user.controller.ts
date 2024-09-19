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
    ): Promise<any> {
        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.userService.getAllUser(pageOption, "");
    }

    @Get("/search")
    async findSearch( @Query() pageOption: {
      page?: number,
      show?: number,
      search?: string,
    }): Promise<{ data: User[], count: number }> {
      return this.userService.getAllUser(pageOption, "search");
    }

    @Get(':id')
    async getUser(
        @Param('id') id: string,
    ): Promise<any> {
        return this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() user: CreateUserDto): Promise<User> {
        return this.userService.createUser(user);
    }
    
    @Delete(':id')
    async deleteUser(
        @Param('id')
        id: string,
    ) {
        return this.userService.deleteUser(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, user);
    }

    @Put('updatePassword/:email')
    async updatePassword(@Param('email') email: string, @Body('password') password: string): Promise<any> {
        return this.userService.updatePassword(email, password);
    }
}