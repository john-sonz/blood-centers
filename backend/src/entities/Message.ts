import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Length } from "class-validator";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  senderId!: string;

  @Column({ type: "uuid" })
  recipientId!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender!: User;

  @ManyToOne(() => User)
  @JoinColumn()
  recipient!: User;

  @Column({ type: "text" })
  @Length(1, 1024)
  text!: string;

  @CreateDateColumn()
  sentAt!: Date;
}
