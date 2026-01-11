import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum UserRole {
  STUDENT = "student",
  AUTHOR = "author",
  ADMIN = "admin",
}

export class CreateUserDto {
  @ApiProperty({
    description: "Email пользователя",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Имя пользователя",
    example: "John Doe",
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Пароль пользователя (минимум 6 символов)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Роль пользователя",
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
