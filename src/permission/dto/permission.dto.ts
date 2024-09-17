import { IsNotEmpty, IsString, IsArray, ValidateNested, ArrayMinSize, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

enum Method {
    READ = 'Read',
    UPDATE = 'Update',
    DELETE = 'Delete',
    CREATE = 'Create',
}

class RoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(Method, { each: true })
    method: Method[]; 
}

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => RoleDto)
    role: RoleDto[];

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  role?: RoleDto[];

  @IsOptional()
  @IsString()
  description?: string;
}