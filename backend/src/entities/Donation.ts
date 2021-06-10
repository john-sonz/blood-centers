import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Receipt } from "./Receipt";

@Entity()
export class Donation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  donatorId: string;

  @CreateDateColumn()
  date!: Date;

  @Column()
  amountMl: number;

  @Column()
  availableMl: number;

  @OneToMany(() => Receipt, (receipt) => receipt.donationId)
  receipts: Receipt[];
}
