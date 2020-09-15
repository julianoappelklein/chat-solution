import io from "socket.io";
import { serviceLocator } from "../service-locator";
import Joi from "joi";
import { join } from "path";
import { use } from "chai";
import { ChatMessageModel } from "../../modules/chat/chat-message-model";

const chatRoomRepository = serviceLocator.getChatRoomRepository();
const chatMessageRepository = serviceLocator.getChatMessageRepository();
const botService = serviceLocator.getBotService();
const jwtService = serviceLocator.getJWTService();
const logger = serviceLocator.getLogger();

export function setupSocketsServer(server: io.Server) {
  const validateMessage = (
    socket: io.Socket,
    schema: Joi.Schema,
    message: any
  ) => {
    const result = schema.validate(message);
    if (result.error) {
      socket.emit("invalid-message", { message: "Invalid message." });
      return false;
    }
    return true;
  };

  const safeHandler = async (
    socket: io.Socket,
    inner: (() => void) | (() => Promise<void>)
  ) => {
    try {
      const result = inner();
      if ((result as any).then) {
        await result;
      }
    } catch (e) {
      logger.logError(e);
      socket.emit("unexpected-error", {
        message: "An unexpected error occured.",
      });
    }
  };

  const authorizeMessage = (socket: io.Socket, message: any) => {
    const userData = jwtService.getVerifiedUserData(message.token);
    if (userData == null) {
      socket.emit("force-disconnect");
    }
    return userData;
  };

  botService.setCommandResultHandler((result) => {
    const room = result.headers?.room;
    let message: String | undefined = result.data?.toString();
    if (result.error) {
      message = result.error.message;
    }
    server.in(room).emit("chat-message", {
      username: "$bot",
      message: message,
      timestamp: new Date(),
    });
  });

  server.on("connect", async (socket) => {
    var rooms = await chatRoomRepository.listRoomsAvailable();

    socket.emit("welcome", {
      chatRooms: rooms.map((x) => ({
        id: x.getId(),
        description: x.getDescription(),
      })),
    });

    socket.on("join-chat-room", (m: any) => {
      safeHandler(socket, async () => {
        if (
          !validateMessage(
            socket,
            Joi.object({
              room: Joi.string().alphanum().required(),
              token: Joi.string(),
            }).required(),
            m
          )
        ) {
          return;
        }

        authorizeMessage(socket, m);

        const room = m.room;
        socket.leaveAll();
        socket.join(room);
        const messages = (
          await chatMessageRepository.getLastChatRoomMessages(room)
        ).map((x) => ({
          username: x.getUsername(),
          message: x.getMessage(),
          timestamp: x.getCreatedOn(),
        }));
        socket.emit("chat-room-welcome", { room, messages });
      });
    });

    socket.on("chat-message", (m: any) => {
      safeHandler(socket, async () => {
        if (
          !validateMessage(
            socket,
            Joi.object({
              message: Joi.string().required().max(500).min(1),
              token: Joi.string(),
            }).required(),
            m
          )
        ) {
          return;
        }
        const userData = authorizeMessage(socket, m);
        if (userData == null) return;

        var room = Object.keys(socket.rooms)[0];
        const message = m.message as string;

        server.in(room).emit("chat-message", {
          message: message,
          username: userData.username,
          timestamp: new Date(),
        });

        if (message.startsWith("/")) {
          botService.enqueueCommand({
            data: message.trimEnd(),
            headers: {
              room,
            },
          });
        } else {
          chatMessageRepository.insertMessage(
            new ChatMessageModel({
              chatRoomId: room,
              createdOn: new Date(),
              message: message,
              username: userData.username,
            })
          );
        }
      });
    });
  });
}
