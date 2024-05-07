import UserModel from '@/models/user.model';
// import { UserModelAttributes as User } from '@/interfaces/models/userModel';
import { UserDTO } from '@/dtos/user.dto';

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface IUserRepository {
  createUser(userProps: CreateUserProps): Promise<UserDTO>;
  getUserById(id: number): Promise<UserDTO>;
}

class UserRepository {
  private _userModel = UserModel;

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<UserDTO> {
    const user = await this._userModel.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    return user.toDTO();
  }

  // async getUserById(id): Promise<UserDTO> {
  //   const user: User = await this._userModel.findByPk(id);

  //   return {
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   };
  // }

  // async updateUserById(id: number, data: Partial<User>): Promise<UserDTO> {
  //   const user: User = await this._userModel.findAndUpdateById(id, data);

  //   return {
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   };
  // }

  // async getAllUsers(): Promise<UserDTO[]> {
  //   const users: User[] = await this._userModel.findAll();

  //   return users.map((user) => {
  //     return {
  //       id: user.id,
  //       username: user.username,
  //       email: user.email,
  //       createdAt: user.createdAt,
  //       updatedAt: user.updatedAt,
  //     };
  //   });
  // }
}

export default UserRepository;
