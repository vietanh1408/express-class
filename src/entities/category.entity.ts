import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "../common/baseEntity";

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true, name: "NAME" })
  name!: string;

  @Column({ name: "IMAGE" })
  image!: string;
}
