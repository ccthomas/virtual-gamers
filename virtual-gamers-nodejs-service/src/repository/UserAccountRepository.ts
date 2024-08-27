import { IAuth, IUserAccount } from '../models/IUserAccount';

export interface IUserAccountRepository {
  // Auth Functions
  findAuthByUsername(username: string): Promise<IAuth | null>;
  saveAuth(auth: IAuth): Promise<void>;

  // User Account functions
  findUserAccountById(id: string): Promise<IUserAccount | null>;
  saveUserAccount(user: IUserAccount): Promise<void>;
}
