import { UserPasswordHashService } from '../application/user-password-hash-service';
import bcrypt from 'bcrypt';

export class UserOneWayPasswordHashService implements UserPasswordHashService{
  async hashPassword(password: string): Promise<string>{
    return bcrypt.hash(password, 10);
  }

  async checkPassword(password: string, hash: string): Promise<boolean>{
    return bcrypt.compare( password, hash);
  }
}