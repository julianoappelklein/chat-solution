import io from "socket.io";
import { serviceLocator } from "./service-locator";

const chatRoomRepository = serviceLocator.getChatRoomRepository();
const chatMessageRepository = serviceLocator.getChatMessageRepository();
const botService = serviceLocator.getBotService();

export function setupSocketsServer(server: io.Server) {
  botService.setCommandResultHandler((result) => {
    const room = result.headers?.room;
    const message = result.result.message;
    //TODO: transform error to message
    server.in(room).emit("chat-message", {
      username: "$bot",
      message: message,
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

    socket.on("join-room", async (m: any) => {
      const room = m.room;
      //TODO: validate room
      socket.leaveAll();
      socket.join(room);
      const messages = await chatMessageRepository.getLastChatRoomMessages(
        room
      );
      socket.emit("joined-room", { room, messages });
    });

    socket.on("chat-message", (id, m: any) => {
      var room = Object.keys(socket.rooms)[0];
      const message = m.message as String;
      server.in(room).emit("chat-message", { message: message });
      if (message.startsWith("/")) {
        botService.enqueueCommand({
          command: message.trimEnd(),
          headers: {
            room,
          },
        });
      }
    });
  });
}
