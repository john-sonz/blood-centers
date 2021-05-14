import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { IsNumberString, Length } from "class-validator";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column()
  @IsNumberString()
  @Length(11)
  pesel!: string;

  @Column()
  passwordHash!: string;

  @Column()
  @Length(2, 255)
  firstName!: string;

  @Column()
  @Length(2, 255)
  lastName!: string;
}
