import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationDTO {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Max(50)
  @Min(0)
  limit: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset: number;
}