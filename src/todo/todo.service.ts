import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { TodoResponseDto } from './dto/todo-response.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User } from 'src/user/user.entity';
import { UpdateTodoDto } from './dto/update-todos.dto';
import { TodoQueryDto } from './dto/todo-query.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createTodoDto: CreateTodoDto,
    id: number,
  ): Promise<TodoResponseDto> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    delete user.password;

    const todo = this.todoRepository.create({
      ...createTodoDto,
      user: user,
    });
    const savedTodo = await this.todoRepository.save(todo);
    return savedTodo;
  }

  async getOwnTodos(
    userId: number,
    queryDto: TodoQueryDto,
  ): Promise<TodoResponseDto[]> {
    const { status } = queryDto;

    const query = this.todoRepository
      .createQueryBuilder('todo')
      .innerJoinAndSelect('todo.user', 'user')
      .where('todo.userId = :userId', { userId });

    if (status) {
      query.andWhere('todo.status = :status', { status });
    }

    return await query
      .select([
        'todo.id',
        'todo.title',
        'todo.description',
        'todo.status',
        'user.id',
        'user.name',
        'user.email',
      ])
      .getMany();
  }

  async getAllTodos(queryDto: TodoQueryDto): Promise<TodoResponseDto[]> {
    const { status } = queryDto;

    const query = this.todoRepository.createQueryBuilder('todo');

    if (status) {
      query.andWhere('todo.status = :status', { status });
    }

    return await query
      .select(['todo.id', 'todo.title', 'todo.description', 'todo.status'])
      .getMany();
  }

  async getById(id: number, userId): Promise<TodoResponseDto> {
    try {
      const todo = await this.todoRepository.findOneOrFail({
        where: { id, user: { id: userId } },
        relations: ['user'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
          },
        },
      });
      return todo;
    } catch {
      throw new NotFoundException(
        `Задача с ID ${id} не найдена или вы не имеете прав на её`,
      );
    }
  }

  async updateTodo(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!todo) {
      throw new NotFoundException(
        `Задача с ID ${id} не найдена или вы не имеете прав на её изменение`,
      );
    }

    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async deleteTodo(id: number, userId: number): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!todo) {
      throw new NotFoundException(
        `Задача с ID ${id} не найдена или вы не имеете прав на её удаление`,
      );
    }

    await this.todoRepository.remove(todo);
    return todo;
  }

  async updateTodoStatus(
    id: number,
    updateStatusDto: UpdateStatusDto,
    userId: number,
  ): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!todo) {
      throw new NotFoundException(
        `Задача с ID ${id} не найдена или вы не имеете прав на её изменение`,
      );
    }

    todo.status = updateStatusDto.status;

    await this.todoRepository.save(todo);

    return todo;
  }
}
