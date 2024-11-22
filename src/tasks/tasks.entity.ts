import { Task, TaskStatus } from '@prisma/client';

export class TaskEntity implements Task {
  readonly id!: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly user_id: string;
}
