import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, name: "USER_NAME" })
  username!: string;

  @Column({ name: "PASSWORD" })
  password!: string;

  @Column({ name: "EMAIL", default: null })
  email: string;

  @Column({ name: "ROLE", default: 0 })
  role: number;
}
