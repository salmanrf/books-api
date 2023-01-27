import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateMemberPenaltyDto } from './dto/create-member-penalty.dto ';
import { MemberPenalty } from './entities/member-penalty.entity';

@Injectable()
export class MemberPenaltiesService {
  constructor(
    @InjectRepository(MemberPenalty)
    private readonly memberPenaltyRepo: Repository<MemberPenalty>,
  ) {}

  async createMemberPenalty(
    createPenaltyDto: CreateMemberPenaltyDto,
    qr?: QueryRunner,
  ) {
    try {
      const { member_id, reason, day_count } = createPenaltyDto;

      const {
        raw: [inserted],
      } = await this.memberPenaltyRepo
        .createQueryBuilder('mp', qr)
        .insert()
        .values({
          member_id,
          reason,
          start_date: () => 'NOW()::DATE',
          end_date: () => `NOW()::DATE + ':${day_count} DAYS'::INTERVAL`,
        })
        .returning('*')
        .execute();

      return inserted;
    } catch (error) {
      throw error;
    }
  }

  async findMemberActivePenalty(criteria: { member_id: string }) {
    try {
      const { member_id } = criteria;

      const penaltyQb = this.memberPenaltyRepo.createQueryBuilder('mp');

      if (!member_id) {
        throw new Error('member_id must be specified.');
      }

      penaltyQb.where({ member_id });
      penaltyQb.andWhere('mp.end_date > NOW()::DATE');

      const penalty = await penaltyQb.getOne();

      return penalty;
    } catch (error) {
      throw error;
    }
  }
}
