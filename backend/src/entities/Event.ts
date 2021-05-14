import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  @Length(2, 255)
  city: string;

  @Column()
  @Length(2, 255)
  adress: string;

  @Column()
  @Length(2, 255)
  description: string;

  @Column({ type: 'timestamptz' })
  date: Date;

}
