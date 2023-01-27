import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberPenaltiesService } from './members-penalty.service';
import { MemberPenalty } from './entities/member-penalty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberPenalty])
  ],
  controllers: [MembersController],
  providers: [MembersService, MemberPenaltiesService],
  exports: [MembersService, MemberPenaltiesService]
})
export class MembersModule {}
