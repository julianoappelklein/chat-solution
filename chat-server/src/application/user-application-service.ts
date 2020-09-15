import { UserModel } from "../modules/user/user-model";
import { UserRepository } from "../modules/user/user-repository";
import { UserPasswordHashService } from "./user-password-hash-service";

export interface UserApplicationServiceConfig {
  userRepository: UserRepository;
  userPasswordHashService: UserPasswordHashService;
}

export class UserApplicationService {
  private _userRepository: UserRepository;
  private _userPasswordHashService: UserPasswordHashService;

  constructor(config: UserApplicationServiceConfig) {
    this._userRepository = config.userRepository;
    this._userPasswordHashService = config.userPasswordHashService;
  }

  async authenticate(data: {
    username: string;
    password: string;
  }): Promise<UserModel | null> {
    const { username, password } = data;
    const user = await this._userRepository.findUserByUsername(username);
    if (user == null) return null;
    const hashedPassword = user.getPassword();
    const valid = await this._userPasswordHashService.checkPassword(
      password,
      hashedPassword
    );
    if (!valid) return null;
    return user;
  }

  async registerUser(data: {
    username: string;
    password: string;
  }): Promise<void> {
    const hashedPassword = await this._userPasswordHashService.hashPassword(
      data.password
    );
    const username = data.username;
    const user = UserModel.New({ username, hashedPassword });
    await this._userRepository.insertUser(user);
  }
}
