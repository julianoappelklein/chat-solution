import { IBotCommand, IBotCommandResult } from "../bot-command-runner";
import { StockClient } from "../stock-client";

export class GetStockInfoBotCommand implements IBotCommand {
  private _stockMessageMatcher: RegExp = /^\/stock=[a-z0-9.:]+$/i;
  private _stockClient: StockClient;

  constructor(cfg: { stockClient: StockClient }) {
    this._stockClient = cfg.stockClient;
  }

  match(message: string): boolean {
    return this._stockMessageMatcher.test(message);
  }

  async execute(message: string): Promise<IBotCommandResult> {
    const stockId = message.split("=").splice(-1)[0];
    const result = await this._stockClient.getStockInfo({ stockId: stockId });
    if (result == null) {
      return {
        error: { message: "Stock not found.", type: "stock-not-found" },
      };
    }
    return { data: result };
  }
}
