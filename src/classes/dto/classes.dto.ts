import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';


export class CreateClassesDto {
  @IsNotEmpty()
  @IsString()
  className: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  studentsId?: string[];

  @IsOptional()
  @IsString()
  teacherId?: string;
}

export class UpdateClassesDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  className?: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  studentsId?: string[];

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
