import { AmqpBotServer } from "./amqp-bot-server";
import { BotCommandRouter } from "./bot-command-router";
import { GetStockInfoBotCommandExecutor } from "./bot-command-executors/get-stock-info";
import { StockClient } from "./stock-client";
import axios from "axios";
import { CSVReader } from "./csv-reader";
import { parseConfig } from "./config";

async function start() {

  const config = parseConfig()

  const axiosClient = axios.create({
    timeout: 1000,
  });

  const csvReader = new CSVReader();

  const stockClient = new StockClient({
    axios: axiosClient,
    csvReader: csvReader,
  });

  const botCommandRouter: BotCommandRouter = new BotCommandRouter({
    executors: [new GetStockInfoBotCommandExecutor({ stockClient: stockClient })],
  });

  var botApplication = new AmqpBotServer({
    rabbitMQConnection: config.rabbitMQConnection,
    botCommandRouter: botCommandRouter
  });

  await botApplication.start();
  console.log("Chat Bot Server started");
};

start().catch(ex =>{
  console.error("Failed to start Chat Bot Server", ex);
});