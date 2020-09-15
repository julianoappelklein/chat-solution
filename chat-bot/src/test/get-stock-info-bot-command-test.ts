import { StockClient } from "../stock-client";
import { assert } from "chai";
import { describe, it } from "mocha";
import { CSVReader } from "../csv-reader";
import axios from "axios";
import { GetStockInfoBotCommandExecutor } from "../bot-command-executors/get-stock-info";

describe("GetStockInfoBotCommandTest", () => {
  var client = new StockClient({
    axios,
    csvReader: new CSVReader(),
  });

  client.getStockInfo = async (a) => {
    return null;
  };

  const command = new GetStockInfoBotCommandExecutor({ stockClient: client });

  it("should match /stock=aapl.us", async () => {
    const result = command.match({ data: "/stock=aapl.us" });
    assert.equal(result, true);
  });

  it("should match /STOCK=aapl.us", async () => {
    const result = command.match({ data: "/STOCK=aapl.us" });
    assert.equal(result, true);
  });

  it("should not match /stock-aapl.us", async () => {
    const result = command.match({ data: "/stock-aapl.us" });
    assert.equal(result, false);
  });
});
