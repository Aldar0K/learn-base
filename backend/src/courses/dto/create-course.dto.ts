import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, MaxLength } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({
    description: "Название курса",
    example: "Введение в программирование",
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: "Описание курса",
    example: "Базовый курс по программированию для начинающих",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
