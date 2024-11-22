import { TaskStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  title: string;

  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
