import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, {
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new ConflictException('Пользователь уже существует');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = manager.create(User, {
        ...userData,
        password: hashedPassword,
      });

      await manager.save(newUser);
      delete newUser.password;
      return newUser;
    });
  }
}
