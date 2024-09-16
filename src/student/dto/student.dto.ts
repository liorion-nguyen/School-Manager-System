import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber, IsDate, IsBoolean, IsUrl } from 'class-validator';

interface Score {
    subjectId: string,
    score: number
};

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  contactParents: string;

  @IsNotEmpty()
  @IsString()
  listScores?: Score[];
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  contactParents?: string;

  @IsNotEmpty()
  @IsString()
  listScores?: Score[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
