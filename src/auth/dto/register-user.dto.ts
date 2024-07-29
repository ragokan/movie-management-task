import { IsInt, IsNotEmpty, IsPositive, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Please provide a username' })
  @MinLength(4, { message: 'Username is too short' })
  username: string;

  @IsNotEmpty({ message: 'Please provide a password' })
  @MinLength(6, { message: 'Password is too short' })
  password: string;

  @IsNotEmpty({ message: 'Please provide an age' })
  @IsPositive({ message: 'Age must be a positive number' })
  @IsInt({ message: 'Age must be an integer' })
  age: number;

  constructor(partial: Partial<RegisterUserDto>) {
    Object.assign(this, partial);
  }
}
