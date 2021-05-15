import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsNumberString, Length } from "class-validator";

import { Message } from "./Message";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column()
  @IsNumberString()
  @Length(11)
  pesel!: string;

  @Column({ select: false })
  passwordHash!: string;

  @Column()
  @Length(2, 255)
  firstName!: string;

  @Column()
  @Length(2, 255)
  lastName!: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Message, (msg) => msg.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (msg) => msg.recipient)
  receivedMessages: Message[];
}
