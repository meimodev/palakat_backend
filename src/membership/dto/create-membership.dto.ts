import { IsInt, IsBoolean } from 'class-validator';

export class CreateMembershipDto {
  @IsInt()
  account_id: number;

  @IsBoolean()
  baptize: boolean;

  @IsInt()
  church_id: number;

  @IsInt()
  column_id: number;

  @IsBoolean()
  sidi: boolean;
}