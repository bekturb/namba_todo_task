import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { TodoStatus } from '../enum/todo-status.enum';

export class TodoQueryDto {
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
