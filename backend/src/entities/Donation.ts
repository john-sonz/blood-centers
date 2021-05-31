import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./Receipt";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    donatorId: string;

    @Column({ type: Date })
    date!: Date;

    @Column()
    amountMl: number;

    @Column()
    availableMl: number;

    @OneToMany(() => Receipt,  receipt => receipt.donationId) receipts: Receipt[];
}