import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../common/baseEntity'

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true, name: 'NAME' })
  name!: string

  @Column({ name: 'IMAGE', default: null })
  image: string

  @Column({ name: 'DESCRIPTION', default: null })
  description: string
}
