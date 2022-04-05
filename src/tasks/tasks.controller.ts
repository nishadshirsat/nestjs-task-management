import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksWithFilters } from './dto/get-tasks-filters.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskStatus } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) { }

  // @Get()
  // getTasks(@Query() getTasksbyFilter: GetTasksWithFilters): Task[] {
  //   if (Object.keys(getTasksbyFilter).length) {
  //     return this.taskService.getTasksWithFilter(getTasksbyFilter);
  //   } else {
  //     return this.taskService.getAllTasks();
  //   }
  // }

  @Get()
  getTasks(
    @Query() getTasksbyFilter: GetTasksWithFilters,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getAllTasks(getTasksbyFilter, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateStatusOfTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
