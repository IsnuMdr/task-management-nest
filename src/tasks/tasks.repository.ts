import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Prisma, Task, User } from '@prisma/client';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksRepository {
  private logger = new Logger('TasksRepository');

  constructor(private prisma: PrismaService) {}

  async findAll(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    try {
      const where: Prisma.TaskWhereInput = {
        user_id: user.id,
        AND: [
          status ? { status } : {},
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              }
            : {},
        ],
      };

      const tasks = await this.prisma.task.findMany({
        where,
      });

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${user.username}. Filters : ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string, user: User): Promise<TaskEntity | null> {
    return this.prisma.task.findUniqueOrThrow({
      where: { id, user },
      include: {
        user: true,
      },
    });
  }

  async create(data: Prisma.TaskCreateInput): Promise<TaskEntity> {
    return this.prisma.task.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.TaskUncheckedUpdateInput,
  ): Promise<TaskEntity> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, user: User): Promise<TaskEntity> {
    return this.prisma.task.delete({
      where: { id, user },
    });
  }
}
