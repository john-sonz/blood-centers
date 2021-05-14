import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Privilege {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 255)
  description: string;

  @Column()
  min_donated_amount_ml: number;

}
