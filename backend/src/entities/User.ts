import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumberString, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumberString()
  @Length(11)
  pesel: string;

  @Column()
  @Length(2, 255)
  firstName: string;

  @Column()
  @Length(2, 255)
  lastName: string;
}
