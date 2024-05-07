import {
  OrderItem,
  Op,
  Model,
  CreationAttributes,
  ModelStatic,
  Attributes,
  WhereOptions,
  Includeable,
  Transaction,
  ModelDefined,
} from 'sequelize';

import { TFindAllProps } from '@/types/repositories/base.repository';

export type Options = {
  transaction?: Transaction;
};

export interface IBaseRepository<T extends Model> {
  create(props: CreationAttributes<T>, options: Options): Promise<T>;
  update(props: T, options: Options): Promise<T>;
  delete(id: number | number[]): Promise<number>;
  delete(id: number | number[], options: Options): Promise<number>;
  findById(
    id: number,
    includes?: string[] | null,
    options?: Options
  ): Promise<T | null>;
  findMultipleByIds(ids: number[], options: Options): Promise<T[] | null>;
  findAll(
    { page, limit, orderBy, includes, where }: TFindAllProps,
    options: Options
  ): Promise<{ data: T[] | null; total: number }>;
}

export default abstract class BaseRepository<T extends Model>
  implements IBaseRepository<T>
{
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  startTransaction(): Promise<Transaction> {
    return this.model.sequelize!.transaction();
  }

  async create(data: CreationAttributes<T>): Promise<T> {
    const result = await this.model.create(data);
    return result;
  }

  async update(data: T): Promise<T> {
    const result = await data.save();
    return result;
  }

  async delete(id: number | number[], options?: Options): Promise<number> {
    const query = {
      where: { id: id as Attributes<T> },
      ...options,
    };

    const deletedRows = await this.model.destroy(query);

    return deletedRows;
  }

  findById(id: number, includes?: string[] | null): Promise<T | null> {
    const queryOpts: {
      include?: Includeable[];
      where: WhereOptions;
    } = {
      where: { id },
    };

    if (includes && includes.length > 0) {
      // queryOpts.include = [];

      // // get all associations based on the includes array
      // const associations = includes.map((include) => {
      //   return this.model.associations[include] as Includeable;
      // });

      // queryOpts.include.push(...associations);

      queryOpts.include = this.mapNestedIncludes(this.model, includes);
    }

    return this.model.findOne(queryOpts);
  }

  findMultipleByIds(ids: number[]): Promise<T[] | null> {
    return this.model.findAll({ where: { id: ids as Attributes<T> } });
  }

  async findAll({
    page,
    limit,
    orderBy,
    includes,
    where,
  }: TFindAllProps): Promise<{ data: T[] | null; total: number }> {
    const offset = (page - 1) * limit;

    const queryOpts: {
      limit: number;
      offset: number;
      order?: OrderItem[];
      include?: Includeable[];
      where?: WhereOptions;
    } = {
      limit,
      offset,
    };

    if (orderBy) {
      const [column, orderType] = orderBy ? orderBy.split(':') : [null, null];
      queryOpts.order = [[column!, orderType!]];
    }

    if (where && Object.keys(where).length > 0) {
      queryOpts.where = {};

      const searchConditions = [];

      for (const key in where) {
        if (Object.prototype.hasOwnProperty.call(where, key)) {
          const condition = {
            [key]: {
              [Op.like]: `%${where[key]}%`,
            },
          };
          searchConditions.push(condition);
        }
      }

      queryOpts.where = {
        [Op.or]: searchConditions,
      };
    }

    if (includes && includes.length > 0) {
      queryOpts.include = [];

      // for (const include of includes) {
      //   queryOpts.include.push(this.model.associations[include] as Includeable);
      // }

      queryOpts.include = this.mapNestedIncludes(this.model, includes);
    }

    const { rows: data, count: total } =
      await this.model.findAndCountAll(queryOpts);

    return { data, total };
  }

  async count(where?: Record<string, string>): Promise<number> {
    const queryOpts: {
      where?: WhereOptions;
    } = {};

    if (where && Object.keys(where).length > 0) {
      queryOpts.where = {};

      const searchConditions = [];

      for (const key in where) {
        if (Object.prototype.hasOwnProperty.call(where, key)) {
          const condition = {
            [key]: {
              [Op.like]: `%${where[key]}%`,
            },
          };
          searchConditions.push(condition);
        }
      }

      queryOpts.where = {
        [Op.or]: searchConditions,
      };
    }

    const count = await this.model.count(queryOpts);

    return count;
  }

  mapNestedIncludes(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelDefined<any, any>,
    includes: string[]
  ): Includeable[] {
    const includeOptions: Includeable[] = [];

    for (const include of includes) {
      const associations = include.split('.');
      let currentModel = model;
      let includeOption: Includeable | null = null;

      for (let i = 0; i < associations.length; i++) {
        const alias = associations[i];

        // Find the association using the alias
        const associationInfo = Object.values(currentModel.associations).find(
          (assoc) => assoc.as === alias
        );

        if (!associationInfo) {
          throw new Error(
            `Association with alias ${alias} not found in model ${currentModel.name}`
          );
        }

        const newIncludeOption: Includeable = {
          model: associationInfo.target,
          as: alias,
        };

        if (includeOption) {
          includeOption.include = [newIncludeOption];
        } else {
          includeOption = newIncludeOption;
          includeOptions.push(includeOption);
        }

        currentModel = associationInfo.target;
      }
    }

    return includeOptions;
  }
}
