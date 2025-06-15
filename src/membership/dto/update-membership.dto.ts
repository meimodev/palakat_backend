import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMembershipDto {
  @IsBoolean()
  @IsOptional()
  baptize?: boolean;

  @IsInt()
  @IsOptional()
  church_id?: number;

  @IsInt()
  @IsOptional()
  column_id?: number;

  @IsBoolean()
  @IsOptional()
  sidi?: boolean;
}
