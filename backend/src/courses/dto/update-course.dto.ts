import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
