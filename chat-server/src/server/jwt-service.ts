import jwt from "jsonwebtoken";

interface JWTServiceConfig {
  hash: string;
}

export interface TokenData {
  username: string;
  userId: string;
}

export class JWTService {
  private _hash;
  constructor(config: JWTServiceConfig) {
    this._hash = config.hash;
  }
  signUserData = (data: TokenData) => {
    return jwt.sign(data, this._hash, { expiresIn: "30min" });
  };

  getVerifiedUserData: (token: string) => TokenData | null = (token) => {
    try {
      return jwt.verify(token, this._hash) as any;
    } catch (e) {
      return null;
    }
  };
}
