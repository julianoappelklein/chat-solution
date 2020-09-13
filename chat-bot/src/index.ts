import { BotApplication } from "./bot-application";
import { BotCommandRunner } from "./bot-command-runner";
import { GetStockInfoBotCommand } from "./bot-commands/get-stock-info";
import { StockClient } from "./stock-client";
import axios from "axios";
import { CSVReader } from "./csv-reader";

async function start() {
  const axiosClient = axios.create({
    timeout: 1000,
  });

  const csvReader = new CSVReader();

  const stockClient = new StockClient({
    axios: axiosClient,
    csvReader: csvReader,
  });

  const botCommandRunner: BotCommandRunner = new BotCommandRunner({
    commands: [new GetStockInfoBotCommand({ stockClient: stockClient })],
  });

  var botApplication = new BotApplication({
    rabbitMQConnection: {
      hostname: "localhost",
      password: "password",
      username: "user",
      port: 5672,
    },
    botCommandRunner: botCommandRunner
  });

  await botApplication.start();
  console.log("Service started");
};

start().catch(ex =>{
  console.error("Failed to start bot server", ex);
});