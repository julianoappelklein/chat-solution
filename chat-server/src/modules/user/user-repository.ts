import { UserModel } from "./user-model";

export interface UserRepository{
  insertUser(user: UserModel): Promise<void>;
  count(): Promise<number>;
  findUserByUsername(username: String): Promise<UserModel|null>;
}