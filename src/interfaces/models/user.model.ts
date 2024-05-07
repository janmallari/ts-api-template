import { BaseModelAttributes } from '@/interfaces/models/base.model';

export interface UserModelAttributes extends BaseModelAttributes {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
