import { PartialType } from "@nestjs/swagger";
import { CreateTaskDTO } from "./create-task.dto";
import { IsBoolean, IsOptional } from "class-validator";

// import { IsBoolean, IsOptional, IsString } from "class-validator";

// export class UpdateTaskDTO {
//   @IsString()
//   @IsOptional()
//   readonly name?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsBoolean()
//   @IsOptional()
//   readonly completed?: boolean;
// }

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}