import { AxiosInstance } from "axios";
import { CSVReader } from "./csv-reader";

export class StockClient {
  private _axios: AxiosInstance;
  private _csvReader: CSVReader;

  constructor(cfg: { axios: AxiosInstance; csvReader: CSVReader }) {
    this._axios = cfg.axios;
    this._csvReader = cfg.csvReader;
  }

  async getStockInfo(data: {
    stockId: string;
  }): Promise<{ [key: string]: any } | null> {
    const response = await this._axios({
      url: `https://stooq.com/q/l/?s=${data.stockId}&f=sd2t2ohlcv&h&e=csv`,
      method: "GET",
      responseType: "stream",
    });
    var rows = await this._csvReader.readFromStream(response.data);
    if (rows.length == 0) {
      return null;
    } else if (rows.length == 1) {
      return rows[0];
    } else {
      throw new Error(
        `More than one result was found for stock "${data.stockId}".`
      );
    }
  }
}