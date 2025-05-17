import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty() // <-- this is important
  password: string;

  @IsIn(['student', 'teacher'])
  role: string;
}
