import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type IAuthenticationFunction = (
  isAdminOnly: boolean
) => (req: Request, res: Response, next: NextFunction) => void;

/**
 * Mock get user function
 */
function getUser() {
  return {
    id: 1,
    email: 'mallari.janlester@gmail.com',
    password: 'password',
    is_admin: true,
  };
}

/**
 *
 * @param isAdminOnly boolean
 */
export const isAuthenticated =
  (isAdminOnly: boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1] as string;

      jwt.verify(token, 'secretkey', async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = user as Record<string, unknown>;

        // get user from database
        // mock getUser function - replace with actual fetching
        // const nurse = await nurseRepository.findById(rest.nurseId as number);
        const userDetails = getUser();

        // if user is not found
        if (!userDetails) {
          return res.sendStatus(403);
        }

        // if it is admin only and user is not admin
        if (isAdminOnly && !userDetails.is_admin) {
          return res.sendStatus(403);
        }

        req.user = userDetails;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
