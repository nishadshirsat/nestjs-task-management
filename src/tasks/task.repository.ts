import { AppDataSource } from 'src';
import { GetTasksWithFilters } from './dto/get-tasks-filters.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> { }
export const TaskRepository = AppDataSource.getRepository(Task);

export const getTasks = async (
  getTaskFilterDto: GetTasksWithFilters,
  user: User,
): Promise<Task[]> => {
  const query = TaskRepository.createQueryBuilder('task');

  const { status, search } = getTaskFilterDto;

  query.where({ user });

  if (status) {
    query.andWhere('task.status = :status', { status });
  }

  if (search) {
    query.andWhere(
      '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
      {
        search: `%${search}%`,
      },
    );
  }

  const tasks = query.getMany();
  return tasks;
};
