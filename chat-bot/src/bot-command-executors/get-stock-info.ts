import { BotCommand, BotCommandExecutor, BotCommandResult } from "../bot-command-router";
import { StockClient } from "../stock-client";

export class GetStockInfoBotCommandExecutor implements BotCommandExecutor {
  private _stockMessageMatcher: RegExp = /^\/stock=[a-z0-9.:]+$/i;
  private _stockClient: StockClient;

  constructor(cfg: { stockClient: StockClient }) {
    this._stockClient = cfg.stockClient;
  }

  match(command: BotCommand): boolean {
    return typeof(command.data) ==='string' && this._stockMessageMatcher.test(command.data);
  }

  async execute(command: BotCommand): Promise<BotCommandResult> {
    const stockId = (command.data as String).split("=").splice(-1)[0];
    const result = await this._stockClient.getStockInfo({ stockId: stockId });
    if (result == null) {
      return {
        error: { message: "Stock not found.", type: "stock-not-found" },
      };
    }
    return { data: `${result.Symbol} quote is $${result.Open} per share` };
  }
}
