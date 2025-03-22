import { ApiProperty } from '@nestjs/swagger';

export class TodoResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор задачи',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название задачи',
    example: 'Учеба по NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Описание задачи (необязательно)',
    example: 'Прочитать документацию по NestJS',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Статус задачи',
    example: 'DONE',
  })
  status: string;
}
