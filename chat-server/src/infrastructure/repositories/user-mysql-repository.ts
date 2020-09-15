import { Pool } from "mysql";
import { UserRepository } from "../../modules/user/user-repository";
import { UserModel } from "../../modules/user/user-model";

export class UserMySqlRepository implements UserRepository {
  _pool: Pool;
  constructor(config: { mysqlPool: Pool }) {
    this._pool = config.mysqlPool;
  }

  insertUser(user: UserModel): Promise<void> {
    return new Promise((resolve, reject) => {
      this._pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.query(
          "INSERT INTO user (id, username, password) VALUES(?, ?, ?)",
          [user.getId(), user.getUsername(), user.getPassword()],
          (err, rows) => {
            connection.release();
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
    });
  }

  async findUserByUsername(username: String): Promise<UserModel|null> {
    const rows: any[] = await new Promise((resolve, reject) => {
      this._pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.query(
          "SELECT * FROM user WHERE username = ? LIMIT 1",
          [username],
          (err, rows) => {
            connection.release();
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
    });
    if(rows.length==0) return null;
    return new UserModel(rows[0]);
  }

  async count(): Promise<number> {
    const rows: any[] = await new Promise((resolve, reject) => {
      this._pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.query("SELECT COUNT(*) as user_count FROM user", [], (err, rows) => {
          connection.release();
          if (err) reject(err);
          else resolve(rows);
        });
      });
    });
    return rows[0].user_count;
  }
}
