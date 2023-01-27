import { Check, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("member_penalties")
export class MemberPenalty {
  @PrimaryGeneratedColumn("uuid")
  member_id: string;

  @Column({type: "date", nullable: false})
  @Check('"start_date" < "end_date"')
  start_date: Date | string;

  @Column({type: "date", nullable: false})
  end_date: Date | string;

  @Column({type: "varchar", length: 50, nullable: false})
  reason: string 
}
