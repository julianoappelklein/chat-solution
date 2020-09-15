import amqplib, { Channel } from "amqplib";
import { BotCommandRouter } from "./bot-command-router";

interface RabbitMQConnectionConfig {
  username: string;
  password: string;
  hostname: string;
  port: number;
}

const CHAT_BOT_QUEUE = "chat_bot_queue";
const CHAT_BOT_RESPONSE_QUEUE = "chat_bot_response";

export class AmqpBotServer {
  _connectionConfig: RabbitMQConnectionConfig;
  _newTaskChannel?: Channel;
  _botCommandRouter: BotCommandRouter;

  constructor(config: {
    rabbitMQConnection: RabbitMQConnectionConfig;
    botCommandRouter: BotCommandRouter;
  }) {
    this._connectionConfig = config.rabbitMQConnection;
    this._botCommandRouter = config.botCommandRouter;
  }

  async startConsumerConnection(): Promise<void> {
    const workConnection = await amqplib.connect(this._connectionConfig);

    process.once("SIGINT", function () {
      workConnection.close();
    });

    const workChannel = await workConnection.createChannel();
    await workChannel.assertQueue(CHAT_BOT_QUEUE, { durable: true });

    Promise.all([
      workChannel.prefetch(1),
      workChannel.consume(
        CHAT_BOT_QUEUE,
        async (queueMessage) => {
          if (queueMessage == null) return; //consumer cancelled by RabbitMQ - should be handled
          const message = queueMessage?.content.toString();
          if (message != null) {
            const result = await this._botCommandRouter.runCommandSafe(message);
            this._newTaskChannel?.emit(JSON.stringify(result));
          }
          workChannel.ack(queueMessage);
        },
        { noAck: false }
      ),
    ]);
  }

  async startProducerConnection(): Promise<void> {
    const newTaskConnection = await amqplib.connect(this._connectionConfig);
    process.once("SIGINT", function () {
      newTaskConnection.close();
    });

    const newTaskChannel = await newTaskConnection.createChannel();
    await newTaskChannel.assertQueue(CHAT_BOT_RESPONSE_QUEUE, {
      durable: true,
    });
    this._newTaskChannel = newTaskChannel;
  }

  async start(): Promise<void> {
    /*
      the start order is important here because before processing tasks
      we need to make sure we have a channel to post replies
    */
    await this.startConsumerConnection();
    await this.startProducerConnection();
  }
}
