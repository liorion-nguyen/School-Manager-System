import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import { Subject } from './entities/subject.entities';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
    constructor(
        @InjectModel(Subject.name) private subjectModel: mongoose.Model<Subject>
    ) { }

    async findSearch(pageOption: {
        page?: number;
        show?: number;
        search?: string;
    }): Promise<any> {
        const limit = pageOption?.show || 10;
        const skip = ((pageOption?.page || 1) - 1) * limit;

        try {
            const [data, totalCount] = await Promise.all([
                this.subjectModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 }), 
                this.subjectModel.countDocuments(),
            ]);

            return {
                status: 200,
                description: 'Get success.',
                data: {
                    data: data,
                    count: totalCount,
                }
            };
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException('Error finding Subjects.', error.message);
        }
    }

    async getSubject(id: string): Promise<any> {
        const data = await this.subjectModel.findById(id);
        if (!data) {
            throw new NotFoundException('Subject not found.');
        }
        return {
            status: 200,
            description: 'Get success.',
            data: data
        };
    }

    async createSubject(Subject: CreateSubjectDto): Promise<any> {
        const data = await this.subjectModel.create(Subject);
        if (data) {
            return {
                status: 200,
                description: 'Create Subject Success.',
                data: data
            };
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateSubject(id: string, Subject: UpdateSubjectDto): Promise<any> {
        const data = await this.subjectModel.findByIdAndUpdate(id, Subject, {
            new: true,
            runValidators: true,
        });
        return {
            status: 200,
            description: 'Update Subject Success.',
            data: data
        };
    }

    async deleteSubject(id: string) {
        const data = await this.subjectModel.findByIdAndDelete(id);
        return {
            status: 200,
            description: 'Delete Subject Success.',
            data: data
        };
    }
}