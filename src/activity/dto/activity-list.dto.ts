import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination.dto';

export class ActivityListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  membershipId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  churchId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  columnId?: number;

  @IsOptional()
  @Type(() => Date)
  startTimestamp?: Date;

  @IsOptional()
  @Type(() => Date)
  endTimestamp?: Date;

  @ValidateIf(
    (o) =>
      o.startTimestamp && o.endTimestamp && o.startTimestamp > o.endTimestamp,
  )
  get invalidRange() {
    throw new Error('startTimestamp must be before or equal to endTimestamp');
  }
}
