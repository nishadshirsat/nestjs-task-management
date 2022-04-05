import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '../task-status.enum';

export class GetTasksWithFilters {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
