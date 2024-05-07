import UserRepository from '@/repositories/user.repository';
// import { UserDTO } from '@/dtos/userDto';

class UserService {
  private _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  // public async getAllUsers(): Promise<UserDTO[]> {
  //   const users: UserDTO[] = await this._userRepository.getAllUsers();

  //   return users;
  // }

  // public async getUserByID(): Promise<UserDTO> {
  //   const user: UserDTO = await this._userRepository.getUserById(1);

  //   return user;
  // }

  // public async updateUsernameById(): Promise<UserDTO> {
  //   const user: UserDTO = await this._userRepository.updateUserById(1, {
  //     username: 'new_username',
  //   });

  //   return user;
  // }

  public async createUser({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const user = await this._userRepository.createUser(
      firstName,
      lastName,
      email,
      password
    );

    return user;
  }
}

export default UserService;
