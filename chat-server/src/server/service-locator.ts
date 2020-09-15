import { ChatRoomRepository } from "../modules/chat/chat-room-repository";
import { ChatMessageRepository } from "../modules/chat/chat-message-repository";
import { ChatRoomMockRepository } from "../infrastructure/repositories/chat-room-mock-repository";
import { UserMySqlRepository } from "../infrastructure/repositories/user-mysql-repository";
import { UserApplicationService } from "../application/user-application-service";
import { UserRepository } from "../modules/user/user-repository";
import { ChatMessageMySqlRepository } from "../infrastructure/repositories/chat-message-mysql-repository";
import { BotService } from "../infrastructure/bot-service/bot-service";
import { AmqpBotClient } from "../infrastructure/bot-service/amqp-bot-client";
import { UserOneWayPasswordHashService } from "../infrastructure/user-one-way-password-hash-service";
import mysql from "mysql";
import { JWTService } from "./jwt-service";

class ServiceLocator {
  private _chatRoomRepository: ChatRoomRepository;
  private _userApplicationService: UserApplicationService;
  private _userRepository: UserRepository;
  private _chatMessageRepository: ChatMessageRepository;
  private _botService: BotService;
  private _jwtService: JWTService;

  constructor() {
    const mysqlConn = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "dev",
      database: "db",
    });

    this._chatRoomRepository = new ChatRoomMockRepository();
    this._userRepository = new UserMySqlRepository({ mysqlPool: mysqlConn });
    this._chatMessageRepository = new ChatMessageMySqlRepository({
      mysqlPool: mysqlConn,
    });

    this._jwtService = new JWTService({ hash: "some-fake-hash" });

    this._userApplicationService = new UserApplicationService({
      userRepository: this._userRepository,
      userPasswordHashService: new UserOneWayPasswordHashService(),
    });

    this._botService = new AmqpBotClient({
      rabbitMQConnection: {
        hostname: "localhost",
        password: "password",
        username: "user",
        port: 5672,
      },
    });
  }

  getChatRoomRepository(): ChatRoomRepository {
    return this._chatRoomRepository;
  }

  getChatMessageRepository(): ChatMessageRepository {
    return this._chatMessageRepository;
  }

  getUserApplicationService(): UserApplicationService {
    return this._userApplicationService;
  }

  getBotService(): BotService {
    return this._botService;
  }

  getUserRepository(): UserRepository {
    return this._userRepository;
  }

  getJWTService(): JWTService {
    return this._jwtService;
  }
}

export const serviceLocator = new ServiceLocator();
