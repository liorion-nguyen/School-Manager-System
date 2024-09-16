import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Student } from './entities/student.entities';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { User } from 'src/user/entities/user.entities';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel: mongoose.Model<Student>,
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
                this.studentModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 }), 
                this.studentModel.countDocuments(),
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
            throw new InternalServerErrorException('Error finding students.', error.message);
        }
    }

    async getStudent(id: string): Promise<any> {
        const student = await this.studentModel.findById(id);
        if (!student) {
            throw new NotFoundException('student not found.');
        }
        return {
            status: 200,
            description: 'Get success.',
            data: student
        };
    }

    async createStudent(student: CreateStudentDto): Promise<any> {
        if (!student.userId) {
            return {
                status: 404,
                description: 'UserId does not exist.'
            };
        }
        const user = await this.userModel.findById(student.userId);
        if (!user) {
            return {
                status: 404,
                description: 'UserId does not exist.'
            };
        }
        const res = await this.studentModel.create(student);
        if (res) {
            return {
                status: 200,
                description: 'Create Student Success.',
                data: res
            };
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateStudent(id: string, student: UpdateStudentDto): Promise<any> {
        const res = await this.studentModel.findByIdAndUpdate(id, student, {
            new: true,
            runValidators: true,
        });
        return {
            status: 200,
            description: 'Update Student Success.',
            data: res
        };
    }

    async deleteStudent(id: string) {
        const res = await this.studentModel.findByIdAndDelete(id);
        return {
            status: 200,
            description: 'Delete Student Success.',
            data: res
        };
    }
}