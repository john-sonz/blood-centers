import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEnum, IsNumberString, Length } from "class-validator";

import { Message } from "./Message";

export enum BloodType {
  AB_RH_MINUS = "AB_RH_MINUS",
  AB_RH_PLUS = "AB_RH_PLUS",
  A_RH_MINUS = "A_RH_MINUS",
  A_RH_PLUS = "A_RH_PLUS",
  B_RH_MINUS = "B_RH_MINUS",
  B_RH_PLUS = "B_RH_PLUS",
  O_RH_MINUS = "O_RH_MINUS",
  O_RH_PLUS = "O_RH_PLUS",
}

type RecipientType = BloodType;
type DonorTypes = BloodType[];

export const BloodCompatibility: Record<RecipientType, DonorTypes> = {
  [BloodType.AB_RH_MINUS]: [
    BloodType.AB_RH_MINUS,
    BloodType.A_RH_MINUS,
    BloodType.B_RH_MINUS,
    BloodType.O_RH_MINUS,
  ],
  [BloodType.AB_RH_PLUS]: Object.values(BloodType),
  [BloodType.A_RH_MINUS]: [BloodType.A_RH_MINUS, BloodType.O_RH_MINUS],
  [BloodType.A_RH_PLUS]: [
    BloodType.A_RH_MINUS,
    BloodType.A_RH_PLUS,
    BloodType.O_RH_MINUS,
    BloodType.O_RH_PLUS,
  ],
  [BloodType.B_RH_MINUS]: [BloodType.B_RH_MINUS, BloodType.O_RH_MINUS],
  [BloodType.B_RH_PLUS]: [
    BloodType.B_RH_MINUS,
    BloodType.B_RH_PLUS,
    BloodType.O_RH_MINUS,
    BloodType.O_RH_PLUS,
  ],
  [BloodType.O_RH_MINUS]: [BloodType.O_RH_MINUS],
  [BloodType.O_RH_PLUS]: [BloodType.O_RH_MINUS, BloodType.O_RH_PLUS],
};

export function areCompatibleBloodTypes(
  recipientType: BloodType,
  donorType: BloodType
): boolean {
  return BloodCompatibility[recipientType].some((type) => type == donorType);
}

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

  @Column({
    type: "enum",
    enum: BloodType,
  })
  @IsEnum(BloodType)
  bloodType!: BloodType;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Message, (msg) => msg.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (msg) => msg.recipient)
  receivedMessages: Message[];
}
