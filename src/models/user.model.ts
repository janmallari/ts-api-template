import { Sequelize, DataTypes } from 'sequelize';

import BaseModel from '@/models/base.model';
import { UserModelAttributes } from '@/interfaces/models/user.model';
import { UserDTO } from '@/dtos/user.dto';

class UserModel extends BaseModel<UserModelAttributes> {
  public first_name!: string;
  public last_name!: string;
  public password!: string;
  public email!: string;

  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
      }
    );
  }

  /**
   * Converts user model to user DTO
   * @returns UserDTO
   */
  public toDTO(): UserDTO {
    return {
      id: this.id,
      firstName: this.first_name,
      lastName: this.last_name,
      email: this.email,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
    };
  }
}

export default UserModel;
