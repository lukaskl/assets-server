import { IsEmail, Length, IsOptional } from 'class-validator';

export class UserCreateRequest {
  @IsEmail()
  email: string;

  @Length(6, 50)
  password: string;

  @Length(2, 100)
  firstName?: string;

  @Length(2, 100)
  lastName?: string;
}

export class UserUpdateRequest {
  @IsEmail()
  @IsOptional()
  email?: string;

  @Length(6, 50)
  @IsOptional()
  password?: string;

  @Length(2, 100)
  @IsOptional()
  firstName?: string;

  @Length(2, 100)
  @IsOptional()
  lastName?: string;
}

export class UserResponse {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
