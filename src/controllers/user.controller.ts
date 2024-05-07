import { Request, Response } from 'express';
import UserService from '@/services/user.service';

class UserController {
  private _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  public createUser = async (req: Request, res: Response) => {
    const user = await this._userService.createUser(req.body);

    return res.status(201).json({ user });
  };
}

export default UserController;
