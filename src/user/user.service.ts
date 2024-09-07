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
        page?: number,
        show?: number,
        search?: string,
    }): Promise<{ data: User[], count: number }> {

        const limit = pageOption?.show;
        const skip = (pageOption?.page - 1) * pageOption?.show;
        const sortOptions: any = {};
        sortOptions.updatedAt = -1;

        // Tạo một đối tượng truy vấn MongoDB
        const query: any = {};

        if (pageOption.search) {
            // Sử dụng biểu thức chính quy để tìm kiếm tên người dùng, tên đầy đủ và liên hệ không phân biệt hoa thường
            const searchRegex = new RegExp(pageOption.search, 'i');
            query.$or = [
                { username: searchRegex },
                { fullname: searchRegex },
                { contact: searchRegex },
            ];
        }

        const users = await this.userModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptions)
            .exec();

        if (!users || users.length === 0) {
            throw new NotFoundException('No users found in the requested page.');
        }

        // Đếm tổng số lượng người dùng phù hợp với truy vấn
        const totalCount = await this.userModel.countDocuments(query);

        return {
            data: users,
            count: totalCount,
        };
    }

    async findSearch(pageOption: {
        page?: number;
        show?: number;
        search?: string;
    }): Promise<{ data: User[]; count: number }> {
        const limit = pageOption?.show || 10; // Số lượng kết quả trên mỗi trang, mặc định là 10
        const skip = ((pageOption?.page || 1) - 1) * limit; // Số kết quả cần bỏ qua (bắt đầu từ 0)

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

            // Sử dụng Promise.all để thực hiện đồng thời tìm kiếm và đếm số lượng kết quả
            const [users, totalCount] = await Promise.all([
                this.userModel
                    .find(query)
                    .select('id fullName profileImage') // Chỉ lấy các trường cần thiết
                    .skip(skip)
                    .limit(limit)
                    .sort({ updatedAt: -1 }), // Sắp xếp theo trường updatedAt giảm dần
                this.userModel.countDocuments(query), // Đếm tổng số kết quả phù hợp
            ]);

            return {
                data: users,
                count: totalCount,
            };
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException('Error finding users.', error.message);
        }
    }

    async findOne(username: string): Promise<any> {
        const res = await this.userModel.findOne({
            username: username
        });
        return res;
    }

    async findCCCD(id: string): Promise<any> {
        const res = await this.userModel.findOne({
            cccdNumber: id
        });
        if (res) {
            return {
                status: 200,
                data: res
            }
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async findProfileImage(id: string): Promise<any> {
        const res = await this.userModel.findOne({
            _id: id
        });
        if (res) {
            return res.profileImage
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async findOneEmail(email: string): Promise<any> {
        const res = await this.userModel.findOne({
            email: email
        });
        return res;
    }

    async getUser(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('user not found.');
        }
        return user;
    }

    async getSearchUsers(content: string): Promise<User[]> {
        let query: any = {}; // Điều kiện truy vấn

        if (content) {
            query.username = { $regex: content, $options: 'i' }; // i: không phân biệt chữ hoa/thường
        }

        const users = await this.userModel
            .find(query)
            .exec();
        if (!users) {
            throw new NotFoundException('user not found.');
        }
        return users;
    }

    async getUserComment(id: string): Promise<{ fullname: string; id: string; username: string }> {
        const user = await this.userModel.findById(id, 'fullname avatar _id username').exec();

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return {
            fullname: user.fullName,
            id: user._id.toString(),
            username: user.username,
        };
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
                data: res
            }
        } else {
            return {
                status: 404,
                description: 'Can not be found.'
            }
        }
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<User> {
        const res = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        });
        return res;
    }

    async deleteUser(id: string) {
        const res = await this.userModel.findByIdAndDelete(id);
        return res;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        await this.userModel.updateOne({ _id: userId }, { refreshToken });
    }

    async getUserById(userId: string) {
        return this.userModel.findById(userId);
    }

    async updatePassword(email: string, newPassword: string): Promise<any> {
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new NotFoundException('User with the given email not found.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return { message: 'Password updated successfully.' };
    }
}