import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository, getTasks } from './task.repository';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksWithFilters } from './dto/get-tasks-filters.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  // constructor(
  //   @InjectRepository(TaskRepository)
  //   private taskRepository: TaskRepository,
  // ) { }
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(getTasksbyFilter: GetTasksWithFilters): Task[] {
  //   const { status, search } = getTasksbyFilter;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.task_status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   }
  //   return tasks;
  // }

  async getAllTasks(
    getTasksbyFilter: GetTasksWithFilters,
    user: User,
  ): Promise<Task[]> {
    return getTasks(getTasksbyFilter, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = await TaskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await TaskRepository.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await TaskRepository.findOneBy({
      id,
      user,
    });
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} Not Found`);
    }
    return found;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // const item = await this.getTaskById(id);
    const result = await TaskRepository.delete({ id, user });
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with Id ${id} Not Found`);
    }
  }
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    TaskRepository.save(task);
    return task;
  }
}
