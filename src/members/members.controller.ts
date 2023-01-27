import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { FindMemberDto } from './dto/find-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    try {
      const res = await this.membersService.create(createMemberDto);

      return {
        status: true,
        data: res
      }
    } catch(error) {
      throw error;
    }
  }

  @Get()
  async findMany(@Query() findDto: FindMemberDto) {
    try {
      const res = await this.membersService.findMany(findDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':member_id')
  async findOne(@Param('member_id') member_id: string) {
    try {
      const res = await this.membersService.findOne(member_id);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':member_id')
  async update(
    @Param('member_id') member_id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    try {
      const res = await this.membersService.update(member_id, updateMemberDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':member_id')
  async remove(@Param('member_id') member_id: string) {
    try {
      const res = await this.membersService.delete(member_id);

      return {
        status: true,
        data: res
      }
    } catch(error) {
      throw error;
    }
  }
}
