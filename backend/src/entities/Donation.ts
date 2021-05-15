import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./Receipt";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    donatorId: number;

    @Column({ type: Date })
    date!: Date;

    @Column()
    amountMl: number;

    @Column()
    availableMl: number;

    @OneToMany(() => Receipt,  receipt => receipt.donationId) receipts: Receipt[];
}