import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TodoStatus } from './enum/todo-status.enum';
import { User } from 'src/user/user.entity';

@Entity('todo')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: 'TODO',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
