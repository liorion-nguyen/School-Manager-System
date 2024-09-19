import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Permission } from './entities/permission.entities';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private PermissionModel: mongoose.Model<Permission>,
    ) { }

    async getAllPermission(pageOption: {
        page?: number,
        show?: number,
        search?: string,
      }): Promise<{ data: Permission[], count: number }> {
        
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
            { Permissionname: searchRegex },
            { fullname: searchRegex },
            { contact: searchRegex },
          ];
        }
      
        const Permissions = await this.PermissionModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec();
      
        if (!Permissions || Permissions.length === 0) {
          throw new NotFoundException('No Permissions found in the requested page.');
        }
      
        // Đếm tổng số lượng người dùng phù hợp với truy vấn
        const totalCount = await this.PermissionModel.countDocuments(query);
      
        return {
          data: Permissions,
          count: totalCount,
        };
      }      

    async findOne(Permissionname: string): Promise<any> {
        const res = await this.PermissionModel.findOne({
            Permissionname: Permissionname
        });
        return res;
    }

    async getPermission(id: string): Promise<Permission> {
        const Permission = await this.PermissionModel.findById(id);
        if (!Permission) {
            throw new NotFoundException('Permission not found.');
        }
        return Permission;
    }

    async getSearchPermissions(content: string): Promise<Permission[]> {
        let query: any = {}; 

        if (content) {
            query.Permissionname = { $regex: content, $options: 'i' };
        }

        const Permissions = await this.PermissionModel
            .find(query)
            .exec();
        if (!Permissions) {
            throw new NotFoundException('Permission not found.');
        }
        return Permissions;
    }

    async createPermission(Permission: CreatePermissionDto): Promise<any> {
        const res = this.PermissionModel.create(Permission);
        return res;
    }

    async updatePermission(id: string, Permission: UpdatePermissionDto): Promise<Permission> {
        const res = await this.PermissionModel.findByIdAndUpdate(id, Permission, {
            new: true,
            runValidators: true,
        });
        return res;
    }
    
    async deletePermission(id: string) {
        const res = await this.PermissionModel.findByIdAndDelete(id);
        return res;
    }
}