import { Router } from 'express';
import type UserController from '@/controllers/user.controller';

class UserRoutes {
  public router: Router;
  private _userController: UserController;

  constructor(userController: UserController) {
    this.router = Router();
    this._userController = userController;
    this._initiateRoutes();
  }

  private _initiateRoutes(): void {
    this.router.get('/users', (request, response) =>
      response.send('Hello Worldsss!!')
    );

    this.router.post('/users', this._userController.createUser);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRoutes;
