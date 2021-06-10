import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Donation } from "./Donation";
import { User } from "./User";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  recipientId!: string;

  @Column({ type: "uuid" })
  donationId!: string;

  @CreateDateColumn()
  date!: Date;

  @Column()
  amount!: number;

  @ManyToOne(() => Donation)
  @JoinColumn()
  donation!: Donation;

  @ManyToOne(() => User)
  @JoinColumn()
  recipient!: User;
}
