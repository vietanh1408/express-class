import { DirectionEnum, PAGE_INDEX, PAGE_SIZE } from '../constants'
type QueryPagingType = {
  query: any
  alias: string
  field: string
  direction: DirectionEnum
  limit?: number
  offset?: number
}

export const initQueryPaging = ({
  query,
  alias,
  field,
  direction,
  limit,
  offset
}: QueryPagingType) => {
  query = query.orderBy(
    `${alias}.${field ?? 'CREATED_AT'}`,
    direction ?? DirectionEnum.ASC
  )

  query = query.limit(limit || PAGE_SIZE)
  query = query.offset(offset || PAGE_INDEX)

  return query
}
