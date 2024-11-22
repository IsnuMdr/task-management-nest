import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Prisma, Task, User } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  async getAllTask(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.findAll(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      return await this.taskRepository.findById(id, user);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const payload: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    return this.taskRepository.create(payload);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      await this.taskRepository.delete(id, user);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.taskRepository.update(id, updateTaskDto);
  }
}
