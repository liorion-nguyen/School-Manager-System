import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entities';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) { }

    async getAllUser(pageOption: {
        page?: number;
        show?: number;
        search?: string;
    }, mode: string): Promise<any> {
        const limit = pageOption?.show || 10;
        const skip = ((pageOption?.page || 1) - 1) * limit;

        try {
            const searchQuery = pageOption?.search?.trim();
            const normalizeText = (text: string) => {
                return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "");
            };

            const normalizedSearchQuery = searchQuery ? normalizeText(searchQuery) : "";

            const query: any = normalizedSearchQuery
                ? {
                    $or: [
                        { fullName: { $regex: normalizeText(searchQuery), $options: 'i' } },
                        { username: { $regex: normalizeText(searchQuery), $options: 'i' } },
                    ],
                }
                : {};
            const [users, totalCount] = await Promise.all([
                this.userModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 })
                    .select(mode === "search" ? 'id fullName profileImage' : ''), 
                this.userModel.countDocuments(query),
            ]);
            return {
                status: 200,
                data: users,
                count: totalCount,
                description: "Retrieve user data successfully"
            };
        } catch (error) {
            return {
                status: 404,
                description: `Error finding users., ${error.message}`
            };
        }
    }

    async findOneUsername(username: string): Promise<any> {
        const res = await this.userModel.findOne({
            username: username
        });
        return res;
    }

    async findOneEmail(email: string): Promise<any> {
        const res = await this.userModel.findOne({
            email: email
        });
        return res;
    }

    async createUser(user: CreateUserDto): Promise<any> {
        const hash: any = await bcrypt.hash(
            user.password,
            10,
        );
        user.password = hash;
        const res = await this.userModel.create(user);

        if (res) {
            return {
                status: 200,
                data: res,
                description: "Account created successfully"
            }
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<any> {
        const res = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        });
        return {
            status: 200,
            description: "Account updated successfully"
        }
    }

    async deleteUser(id: string) {
        const res = await this.userModel.findByIdAndDelete(id);
        return {
            status: 200,
            description: "Account deleted successfully"
        }
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        await this.userModel.updateOne({ _id: userId }, { refreshToken });
    }

    async getUserById(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('user not found.');
        }
        return {
            status: 200,
            data: user,
            description: 'Retrieve user information successfully.'
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<any> {
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            return {
                status: 404,
                description: 'User with the given email not found.'
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        return {
            status: 200,
            data: user,
            description: 'Password updated successfully.'
        }
    }
}