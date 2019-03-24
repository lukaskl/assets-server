import { IsEmail } from 'class-validator';

export class AuthPayload {
  @IsEmail()
  email: string;

  password: string;
}
