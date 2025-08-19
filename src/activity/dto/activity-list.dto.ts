import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
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

  @ValidateIf((o) => {
    if (
      o.startTimestamp &&
      o.endTimestamp &&
      o.startTimestamp > o.endTimestamp
    ) {
      throw new BadRequestException(
        'startTimestamp must be before or equal to endTimestamp',
      );
    }
    return false;
  })
  _validateDateRange?: never;
}
