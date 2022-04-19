import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../common/baseEntity'

@Entity()
export class FileStorage extends BaseEntity {
  @Column({ unique: true, name: 'FILE_PATH' })
  filePath: string

  @Column({ name: 'URL', default: null })
  url: string

  @Column({ name: 'PUBLIC_ID', default: null })
  publicId: string

  @Column({ name: 'SECURE_URL', default: null })
  secureUrl: string
}
