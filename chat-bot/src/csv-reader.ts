import csv from "csv-parser";
import { Stream } from "stream";

export class CSVReader {
  readFromStream(stream: Stream): Promise<Array<{ [key: string]: any }>> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      try {
        stream
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("error",(ex) =>{
            reject(ex);
          })
          .on("end", () => {
            resolve(results);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}
