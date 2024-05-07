import { Model } from 'sequelize';

import { BaseModelAttributes } from '@/interfaces/models/base.model';

class BaseModel<T> extends Model<T & BaseModelAttributes> {
  public id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // TODO: This is not working, refactor
  static async findByPkAndUpdate<T>(id: number, data: Partial<T>) {
    const res = await this.update(data, { where: { id }, returning: true });
    console.log('RES: ', res);

    return res;
  }
}

export default BaseModel;
