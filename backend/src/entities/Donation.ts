import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./Receipt";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    donatorId: number;

    @Column({ type: Date })
    date: Date;

    @Column()
    amountMl: number;

    @Column()
    availableMl: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToMany(_type => Receipt,  receipt => receipt.donationId) receipts: Receipt[];
}