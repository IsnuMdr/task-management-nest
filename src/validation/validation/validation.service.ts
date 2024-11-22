import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: ZodType<T>, data: T): T {
    const result = schema.parse(data);
    return result;
  }
}
