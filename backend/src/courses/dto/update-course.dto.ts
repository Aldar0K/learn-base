import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCourseDto {
  @ApiProperty({
    description: "Название курса",
    example: "Введение в программирование",
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: "Описание курса",
    example: "Базовый курс по программированию для начинающих",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Опубликован ли курс",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
