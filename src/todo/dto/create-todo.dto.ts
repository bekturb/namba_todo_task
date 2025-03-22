import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { TodoStatus } from '../enum/todo-status.enum';

export class CreateTodoDto {
  @ApiProperty({
    description: 'Название задачи',
    example: 'Учеба по NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Описание задачи',
    example: 'Прочитать документацию по NestJS',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Статус задачи',
    enum: TodoStatus,
    example: TodoStatus.TODO,
    required: false,
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
