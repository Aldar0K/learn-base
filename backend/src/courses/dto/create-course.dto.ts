import { IsNotEmpty, IsString, IsOptional, MaxLength } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

