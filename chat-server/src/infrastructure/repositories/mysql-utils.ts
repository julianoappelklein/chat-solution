import { Connection } from "mysql";

export function queryPromise(
  connection: Connection,
  query: string,
  values: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.connect((error) => {
      if (error) {
        reject(error);
      }
      connection.query(
        query,
        values,
        (err, rows) => {
          if (err) {
            reject(err);
          } else resolve(rows);
        }
      );
    });
  });
}
