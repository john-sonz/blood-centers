import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Donation } from "./Donation";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  receipentId: string;

  @Column({ type: "uuid" })
  donationId: string;

  @CreateDateColumn()
  date!: Date;

  @Column()
  amount: number;

  @ManyToOne(() => Donation, (donation) => donation.id) donation: Donation;
}
