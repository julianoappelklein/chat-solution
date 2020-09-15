import { uuidv4 } from "../shared/uuidv4";

interface UserModelData {
  id: string;
  username: string;
  password: string;
}

export class UserModel {
  static New(data: { hashedPassword: string; username: string }): UserModel {
    return new UserModel({
      id: uuidv4(),
      username: data.username,
      password: data.hashedPassword,
    });
  }

  getUsername(): string{
    return this._data.username;
  }

  setUsername(username: string){
    this._data.username = username;
  }

  getId(): string{
    return this._data.id;
  }

  getPassword(){
    return this._data.password;
  }

  setPassword(password: string){
    this._data.password =  password;
  }

  _data: UserModelData;
  constructor(data: UserModelData) {
    this._data = data;
  }
}
