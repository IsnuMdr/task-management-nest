import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
});

describe('TasksService', () => {
  let taskService: TasksService;
  let tasksRepository: TasksRepository;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        PrismaService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    taskService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('getTasks', () => {
    it('call TasksRepository.getTasks return be result', async () => {
      const testTasks = [];

      prisma.task.findMany.mockResolvedValueOnce(testTasks);

      expect(taskService.getAllTask).resolves.toBe(testTasks);
    });
  });
});
