import { IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
