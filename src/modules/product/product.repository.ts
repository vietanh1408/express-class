import { Category } from '../../entities/category.entity'
import { ProductFilter } from 'interfaces/product.interface'
import { Brackets } from 'typeorm'
import { Product } from '../../entities/product.entity'
import { initQueryPaging } from '../../extensions/queryBuilder'
import { decodedStringToArray } from '../../extensions/string'

export class ProductRepository {
  public async getAll(filter: ProductFilter): Promise<[Product[], number]> {
    const { keyword, limit, offset, direction, field } = filter

    const categoryIds = filter?.categoryIds
      ? decodedStringToArray(filter?.categoryIds)
      : []

    const alias = 'p'

    let queryBuilder = Product.createQueryBuilder(alias).leftJoinAndSelect(
      `${alias}.category`,
      'category'
    )

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((k) => {
          k.where(`LOWER(${alias}.NAME) LIKE :keyword`, {
            keyword: `%${keyword.toLocaleLowerCase()}%`
          })
        })
      )
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder = queryBuilder.andWhere(
        `${alias}.CATEGORY_ID IN (:...categoryIds)`,
        {
          categoryIds
        }
      )
    }

    console.log('📢[product.repository.ts:38]: queryBuilder: ', queryBuilder)

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
