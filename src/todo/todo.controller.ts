import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TokenPayload } from 'src/common/interfaces/token-payload.interface';
import { UpdateTodoDto } from './dto/update-todos.dto';
import { TodoQueryDto } from './dto/todo-query.dto';

@Controller('todo')
@ApiTags('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Создать задачу' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: 201,
    description: 'Задача успешно создана',
    type: TodoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private create(
    @Body() todoDto: CreateTodoDto,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    const user: TokenPayload = req.user;
    return this.todoService.create(todoDto, user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('own')
  @ApiOperation({ summary: 'Получить задачи текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список задач пользователя',
    type: [TodoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Задачи не найдены' })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private getAllOwnTodos(
    @Query() queryDto: TodoQueryDto,
    @Req() req: any,
  ): Promise<TodoResponseDto[]> {
    const user: TokenPayload = req.user;
    return this.todoService.getOwnTodos(user.sub, queryDto);
  }

  @UseGuards(AuthGuard)
  @Get('own/:id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Задача найдена',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена',
  })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private getById(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    const user: TokenPayload = req.user;
    return this.todoService.getById(id, user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiResponse({
    status: 200,
    description: 'Список всех задач',
    type: [TodoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Задачи не найдены' })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private getAllTodos(
    @Query() queryDto: TodoQueryDto,
  ): Promise<TodoResponseDto[]> {
    return this.todoService.getAllTodos(queryDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiParam({ name: 'id', type: Number, description: 'ID задачи' })
  @ApiBody({ type: UpdateTodoDto, description: 'Данные для обновления задачи' })
  @ApiResponse({
    status: 200,
    description: 'Задача успешно обновлена',
    type: TodoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена или вы не имеете прав на её изменение',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    const user: TokenPayload = req.user;
    return this.todoService.updateTodo(id, updateTodoDto, user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить задачу по ID' })
  @ApiParam({ name: 'id', description: 'ID задачи для удаления' })
  @ApiResponse({
    status: 200,
    description: 'Задача успешно удалена',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена или вы не имеете прав на её удаление',
  })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private async delete(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    const user: TokenPayload = req.user;
    return this.todoService.deleteTodo(id, user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Обновить статус задачи по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID задачи',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Статус задачи успешно обновлён',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена или вы не имеете прав на её изменение',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные для обновления статуса',
  })
  @ApiResponse({ status: 401, description: 'Токен не предоставлен!' })
  private updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    const user: TokenPayload = req.user;
    return this.todoService.updateTodoStatus(id, updateStatusDto, user.sub);
  }
}
