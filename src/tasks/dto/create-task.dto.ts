import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly description: string;
}