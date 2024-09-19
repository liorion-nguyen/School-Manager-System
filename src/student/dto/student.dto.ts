import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

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

  @IsOptional()
  @IsString()
  listScores?: Score[];
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  contactParents?: string;

  @IsOptional()
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
