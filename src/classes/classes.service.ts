import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import { Classes } from './entities/classes.entities';
import { CreateClassesDto, UpdateClassesDto } from './dto/classes.dto';

@Injectable()
export class ClassesService {
    constructor(
        @InjectModel(Classes.name) private classesModel: mongoose.Model<Classes>
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
                this.classesModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 }), 
                this.classesModel.countDocuments(),
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
            throw new InternalServerErrorException('Error finding Classess.', error.message);
        }
    }

    async getClasses(id: string): Promise<any> {
        const data = await this.classesModel.findById(id);
        if (!data) {
            throw new NotFoundException('Classes not found.');
        }
        return {
            status: 200,
            description: 'Get success.',
            data: data
        };
    }

    async createClasses(classes: CreateClassesDto): Promise<any> {
        const data = await this.classesModel.create(classes);
        if (data) {
            return {
                status: 200,
                description: 'Create Classes Success.',
                data: data
            };
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateClasses(id: string, Classes: UpdateClassesDto): Promise<any> {
        const data = await this.classesModel.findByIdAndUpdate(id, Classes, {
            new: true,
            runValidators: true,
        });
        return {
            status: 200,
            description: 'Update Classes Success.',
            data: data
        };
    }

    async deleteClasses(id: string) {
        const data = await this.classesModel.findByIdAndDelete(id);
        return {
            status: 200,
            description: 'Delete Classes Success.',
            data: data
        };
    }
}