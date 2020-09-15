import amqplib, { Channel } from "amqplib";
import { BotCommand, BotCommandResult, BotService } from "./bot-service";

interface RabbitMQConnectionConfig {
  username: string;
  password: string;
  hostname: string;
  port: number;
}

const CHAT_BOT_QUEUE = "chat_bot_queue";
const CHAT_BOT_RESPONSE_QUEUE = "chat_bot_response";

export class AmqpBotClient implements BotService {
  private _connectionConfig: RabbitMQConnectionConfig;
  private _producerChannel?: Channel;
  private _handler?: (result: BotCommandResult) => void;

  constructor(config: { rabbitMQConnection: RabbitMQConnectionConfig }) {
    this._connectionConfig = config.rabbitMQConnection;
  }

  public enqueueCommand(command: BotCommand): void {
    this._producerChannel?.emit(JSON.stringify(command));
  }

  public setCommandResultHandler(
    handler: (result: BotCommandResult) => void
  ): void {
    this._handler = handler;
    this.start();
  }

  private async startConsumerConnection(): Promise<void> {
    const consumerConnection = await amqplib.connect(this._connectionConfig);

    process.once("SIGINT", function () {
      consumerConnection.close();
    });

    const consumerChannel = await consumerConnection.createChannel();
    await consumerChannel.assertQueue(CHAT_BOT_RESPONSE_QUEUE, {
      durable: true,
    });

    Promise.all([
      consumerChannel.prefetch(1),
      consumerChannel.consume(
        CHAT_BOT_RESPONSE_QUEUE,
        async (queueMessage) => {
          if (queueMessage == null) return; //consumer cancelled by RabbitMQ - should be handled
          const message = queueMessage?.content.toString();
          if (message != null) {
            this._handler?.(JSON.parse(message));
          }
          consumerChannel.ack(queueMessage);
        },
        { noAck: false }
      ),
    ]);
  }

  private async startProducerConnection(): Promise<void> {
    const producerConnection = await amqplib.connect(this._connectionConfig);
    process.once("SIGINT", function () {
      producerConnection.close();
    });

    const producerChannel = await producerConnection.createChannel();
    await producerChannel.assertQueue(CHAT_BOT_QUEUE, {
      durable: true,
    });
    this._producerChannel = producerChannel;
  }

  public async start(): Promise<void> {
    await this.startConsumerConnection();
    await this.startProducerConnection();
  }
}
