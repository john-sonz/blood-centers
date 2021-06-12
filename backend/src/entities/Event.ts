import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Length } from "class-validator";
import { User } from "./User";

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

  @ManyToMany(() => User, (user) => user.events, { cascade: true })
  @JoinTable({ name: "users_events_interests" })
  interestedUsers: User[];
}
