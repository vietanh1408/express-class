import { UserFilter } from "interfaces/user.interface";
import { Brackets } from "typeorm";
import { User } from "../entities/User.entity";
import { initQueryPaging } from "../extensions/queryBuilder";

export class UserRepository {
  public async getAll(filter: UserFilter): Promise<[User[], number]> {
    const { keyword, limit, page, direction, field } = filter;

    const alias = "u";

    let queryBuilder = User.createQueryBuilder(alias);

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((k) => {
          k.where(`LOWER(${alias}.USER_NAME) LIKE :keyword`, {
            keyword: `%${keyword.toLocaleLowerCase()}%`,
          });
        })
      );
    }

    queryBuilder = initQueryPaging({
      query: queryBuilder,
      alias,
      field,
      direction,
      limit,
      offset: page,
    });

    return await queryBuilder.getManyAndCount();
  }
}
