import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

interface Class {
  teacherId: string,
  classId: string,
}

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  classes?: Class[];

  @IsOptional()
  @IsString()
  countTime?: string;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  classes?: Class[];

  @IsOptional()
  @IsString()
  countTime?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
