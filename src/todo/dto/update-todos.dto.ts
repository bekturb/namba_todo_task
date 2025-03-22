import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
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
}
