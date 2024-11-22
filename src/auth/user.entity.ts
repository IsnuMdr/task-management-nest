import { User } from '@prisma/client';

export class UserEntity implements User {
  readonly id: string;
  readonly username: string;
  readonly password: string;
}
