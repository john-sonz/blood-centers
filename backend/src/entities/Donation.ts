import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Receipt } from "./Receipt";
import { User } from "./User";

@Entity({ name: "donations" })
export class Donation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  donatorId!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  donator!: User;

  @CreateDateColumn()
  date!: Date;

  @Column()
  amountMl!: number;

  @Column()
  availableMl!: number;

  @OneToMany(() => Receipt, (receipt) => receipt.donation)
  receipts: Receipt[];
}
