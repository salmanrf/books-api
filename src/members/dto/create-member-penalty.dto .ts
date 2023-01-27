import { IsString } from 'class-validator';

export class CreateMemberPenaltyDto {
  member_id: string;

  day_count: number;
  
  reason: string;
}
