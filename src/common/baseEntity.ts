import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeORMEntity,
} from "typeorm";

export class BaseEntity extends TypeORMEntity {
  @PrimaryGeneratedColumn("uuid", { name: "ID" })
  id!: string;

  @CreateDateColumn({ name: "CREATED_AT", type: "timestamp" })
  createdAt!: Date;

  @CreateDateColumn({ name: "UPDATED_AT", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "DELETED_AT", type: "timestamp" })
  deletedAt!: Date;

  @BeforeInsert()
  async setCreatedAt(): Promise<void> {
    this.createdAt = new Date();
  }
}
