import axios from 'axios';

export class AuthenticationAPI{
  async authenticate(data: {username: string, password: string}): Promise<any>{
    const result = await axios.post("/api/users/authenticate", data);
    return result.data;
  }
}