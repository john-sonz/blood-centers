import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Length } from "class-validator";

@Entity({ name: "privileges" })
export class Privilege {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(2, 255)
  description!: string;

  @Column()
  minDonatedAmountMl!: number;
}
