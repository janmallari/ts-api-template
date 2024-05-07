import express, { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import expressConfig from '@/config/expressConfig';

//
// TODO find ways on how to programmatically import files and their dependencies

// models
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import UserModel from '@/models/user.model';

// repositories
import UserRepository from './repositories/user.repository';

// services
import UserService from './services/user.service';

// controllers
import UserController from '@/controllers/user.controller';

// routes
import UserRoutes from '@/routes/user.routes';

// middlewares
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isAuthenticated } from '@/middlewares/authentication';
import { exceptionHandler } from '@/middlewares/error';

function loadApp() {
  // repositories
  const userRepository = new UserRepository();

  // services
  const userService = new UserService(userRepository);

  // middlewares

  // controllers
  const userController = new UserController(userService);

  // routes
  const userRoutes = new UserRoutes(userController);

  const app: Application = express();

  expressConfig(app);

  // TODO: Add api version support
  app.use('/v1/', userRoutes.getRouter());

  app.use(exceptionHandler);

  /**
   * Swagger setup
   */

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API',
        version: '1.0.0',
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Residents',
        description: 'API for managing residents',
      },
    ],
    apis: ['./src/routes/*.ts'], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
}

export default loadApp;
