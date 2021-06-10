import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Donation } from "./Donation";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  receipentId: string;

  @Column()
  donationId: string;

  @Column({ type: Date })
  date!: Date;

  @Column()
  ammount: number;

  @ManyToOne(() => Donation, (donation) => donation.id) donation: Donation;
}
