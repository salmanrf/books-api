import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPagination, GetPaginatedData } from 'src/common/utils/pagination.util';
import { ILike, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { FindMemberDto } from './dto/find-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>
  ) {}
  
  async create(createMemberDto: CreateMemberDto) {
    try {
      const newMember = await this.memberRepo.save(createMemberDto);

      return newMember;
    } catch (error) {
      if(error.message.includes("duplicate key value violates unique constraint")) {
        throw new BadRequestException("Duplicate member code.");
      }
      
      throw error;
    }
  }

  async findMany(findDto: FindMemberDto) {
    try {
      const { code, page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const memberQb = this.memberRepo.createQueryBuilder('m');

      const fields = ['code', 'name', 'created_at'];
      const orders = ['ASC', 'DESC'];

      if (code) {
        memberQb.andWhere({ code: ILike('%:code%') }, { code });
      }

      if (!fields.includes(sort_field)) {
        sort_field = 'created_at';
      }

      if (!orders.includes(sort_order)) {
        sort_order = 'DESC';
      }

      if(limit != null) {
        memberQb.take(limit);
      }
      memberQb.skip(offset);

      memberQb.addOrderBy("m." + sort_field, sort_order);

      const results = await memberQb.getManyAndCount();
      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findOne(member_id: string) {
    try {
      const member = await this.memberRepo.findOne({ where: { member_id: member_id } });

      if (!member) {
        throw new NotFoundException("Can't find member.");
      }

      return member;
    } catch (error) {
      throw error;
    }
  }

  async update(member_id: string, updateMemberDto: UpdateMemberDto) {
    try {
      const {code, name} = updateMemberDto
      const member = await this.memberRepo.findOne({ where: { member_id } });

      if (!member) {
        throw new NotFoundException("Can't find member.");
      }

      if(code != null) {
        member.code = code
      }
      if(name != null) {
        member.name = name
      }
      
      return this.memberRepo.save(member);
    } catch (error) {
      if(error.message.includes("duplicate key value violates unique constraint")) {
        throw new BadRequestException("Duplicate member code.");
      }

      throw error;
    }
  }

  async delete(member_id: string) {
    try {
      const member = await this.memberRepo.findOne({ where: { member_id } });

      if (!member) {
        throw new NotFoundException("Can't find member.");
      }

      await this.memberRepo.softDelete({ member_id });

      return member;
    } catch (error) {
      throw error;
    }
  }
}
