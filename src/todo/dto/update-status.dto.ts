import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TodoStatus } from '../enum/todo-status.enum';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Статус задачи',
    enum: TodoStatus,
    example: TodoStatus.TODO,
  })
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
