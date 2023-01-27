import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("members")
export class Member {
  @PrimaryGeneratedColumn("uuid")
  member_id: string;

  @Column({type: "varchar", length: 10, nullable: false, unique: true})
  code: string;

  @Column({type: "varchar", length: 255, nullable: false})
  name: string;

  @CreateDateColumn()
  created_at: Date | string;
  
  @UpdateDateColumn()
  updated_at: Date | string;

  @DeleteDateColumn({select: false})
  deleted_at: Date | string;
}
