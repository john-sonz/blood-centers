import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Donation } from "./Donation";

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    receipentId: number;

    @Column()
    donationId: number;

    @Column({ type: Date })
    date: Date

    @Column()
    ammount: number;

    @ManyToOne (() => Donation, donation => donation.id) donation: Donation;
}