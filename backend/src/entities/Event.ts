import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Length } from "class-validator";

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(2, 255)
  city!: string;

  @Column()
  @Length(2, 255)
  address!: string;

  @Column()
  @Length(2, 255)
  description: string;

  @Column({ type: "timestamptz" })
  date!: Date;
}
