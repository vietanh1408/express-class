import { UserFilter } from 'interfaces/user.interface'
import { Brackets } from 'typeorm'
import { User } from '../../entities/user.entity'
import { initQueryPaging } from '../../extensions/queryBuilder'

export class UserRepository {
  public async getAll(filter: UserFilter): Promise<[User[], number]> {
    const { keyword, role, limit, offset, direction, field } = filter

    const alias = 'u'

    let queryBuilder = User.createQueryBuilder(alias)

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((k) => {
          k.where(`LOWER(${alias}.USER_NAME) LIKE :keyword`, {
            keyword: `%${keyword.toLocaleLowerCase()}%`
          }).orWhere(`LOWER(${alias}.EMAIL) LIKE :keyword`, {
            keyword: `%${keyword.toLocaleLowerCase()}%`
          })
        })
      )
    }

    if (role !== null && role !== undefined) {
      queryBuilder = queryBuilder.andWhere(`${alias}.ROLE = ${role}`)
    }

    queryBuilder = initQueryPaging({
      query: queryBuilder,
      alias,
      field,
      direction,
      limit,
      offset
    })

    try {
      return await queryBuilder.getManyAndCount()
    } catch (e) {
      throw e
    }
  }
}
