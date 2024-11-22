import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(username: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          username,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = authCredentialsDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
