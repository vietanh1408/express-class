import { CategoryFilter } from 'interfaces/category.interface'
import { Brackets } from 'typeorm'
import { Category } from '../../entities/category.entity'
import { initQueryPaging } from '../../extensions/queryBuilder'

export class CategoryRepository {
  public async getAll(filter: CategoryFilter): Promise<[Category[], number]> {
    const { keyword, limit, page, direction, field } = filter

    const alias = 'c'

    let queryBuilder = Category.createQueryBuilder(alias)

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((k) => {
          k.where(`LOWER(${alias}.NAME) LIKE :keyword`, {
            keyword: `%${keyword.toLocaleLowerCase()}%`
          })
        })
      )
    }

    queryBuilder = initQueryPaging({
      query: queryBuilder,
      alias,
      field,
      direction,
      limit,
      offset: page
    })

    try {
      return await queryBuilder.getManyAndCount()
    } catch (e) {
      throw e
    }
  }
}
