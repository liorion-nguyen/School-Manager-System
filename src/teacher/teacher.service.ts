import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Teacher } from './entities/teacher.entities';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { User } from 'src/user/entities/user.entities';

@Injectable()
export class TeacherService {
    constructor(
        @InjectModel(Teacher.name) private teacherModel: mongoose.Model<Teacher>,
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) { }
    async findSearch(pageOption: {
        page?: number;
        show?: number;
        search?: string;
    }): Promise<any> {
        const limit = pageOption?.show || 10;
        const skip = ((pageOption?.page || 1) - 1) * limit;

        try {
            const [users, totalCount] = await Promise.all([
                this.teacherModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 }), 
                this.teacherModel.countDocuments(),
            ]);

            return {
                status: 200,
                description: 'Get success.',
                data: {
                    data: users,
                    count: totalCount,
                }
            };
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException('Error finding Teachers.', error.message);
        }
    }

    async getTeacher(id: string): Promise<any> {
        const teacher = await this.teacherModel.findById(id);
        if (!teacher) {
            throw new NotFoundException('Teacher not found.');
        }
        return {
            status: 200,
            description: 'Get success.',
            data: Teacher
        };
    }

    async createTeacher(teacher: CreateTeacherDto): Promise<any> {
        if (!teacher.userId) {
            return {
                status: 404,
                description: 'UserId does not exist.'
            };
        }
        const user = await this.userModel.findById(teacher.userId);
        if (!user) {
            return {
                status: 404,
                description: 'UserId does not exist.'
            };
        }
        const res = await this.teacherModel.create(teacher);
        if (res) {
            return {
                status: 200,
                description: 'Create Teacher Success.',
                data: res
            };
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateTeacher(id: string, Teacher: UpdateTeacherDto): Promise<any> {
        const res = await this.teacherModel.findByIdAndUpdate(id, Teacher, {
            new: true,
            runValidators: true,
        });
        return {
            status: 200,
            description: 'Update Teacher Success.',
            data: res
        };
    }

    async deleteTeacher(id: string) {
        const res = await this.teacherModel.findByIdAndDelete(id);
        return {
            status: 200,
            description: 'Delete Teacher Success.',
            data: res
        };
    }
}