import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../common/baseEntity'
import { Category } from './category.entity'
import { FileStorage } from './fileStorage.entity'

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true, name: 'NAME' })
  name!: string

  @Column({ name: 'IMAGE_ID', default: null })
  imageId: string

  @Column({ name: 'DESCRIPTION', default: null })
  description: string

  @Column({ name: 'PRICE', default: 0 })
  price: number

  @Column({ name: 'CATEGORY_ID' })
  categoryId: string

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'CATEGORY_ID' })
  category: Category

  @OneToOne(() => FileStorage, (fileStorage) => fileStorage.id)
  @JoinColumn({ name: 'IMAGE_ID' })
  image: FileStorage
}
