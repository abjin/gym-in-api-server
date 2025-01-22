import { User } from '../../users/user';

declare global {
  declare namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
