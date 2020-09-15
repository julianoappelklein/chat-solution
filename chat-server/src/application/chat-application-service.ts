import { ChatMessageRepository } from "../modules/chat/chat-message-repository";
import { ChatRoomRepository } from "../modules/chat/chat-room-repository";

interface ChatApplicationServiceConfig {
  chatMessageRepository: ChatMessageRepository;
  chatRoomRepository: ChatRoomRepository;
}

export class ChatApplicationService {

  constructor(config: ChatApplicationServiceConfig) {

  }

  insertMessage(data: {username: string, message: string}): void{

  }
}
