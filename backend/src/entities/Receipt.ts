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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToOne (_type => Donation, donation => donation.id) donation: Donation;
}