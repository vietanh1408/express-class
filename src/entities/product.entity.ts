import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../common/baseEntity";
import { Category } from "./category.entity";

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true, name: "NAME" })
  name!: string;

  @Column({ name: "IMAGE", default: null })
  image: string;

  @Column({ name: "DESCRIPTION", default: null })
  description: string;

  @Column({ name: "PRICE", default: 0 })
  price: number;

  @Column({ name: "CATEGORY_ID" })
  categoryId: string;

  @OneToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: "CATEGORY_ID" })
  category: Category;
}
