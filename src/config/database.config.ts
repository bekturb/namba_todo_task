import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Todo } from 'src/todo/todo.entity';
import { User } from 'src/user/user.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [Todo, User],
    synchronize: false,
    logging: true,
  };
};
