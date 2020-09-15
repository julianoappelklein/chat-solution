import { ChatMessageRepository } from "../../modules/chat/chat-message-repository";
import { ChatMessageModel } from "../../modules/chat/chat-message-model";

export class ChatMessageMySqlRepository implements ChatMessageRepository{
  getLastChatRoomMessages(chatRoomId: String): Promise<ChatMessageModel[]>{
    throw new Error("Not implemented");
  }
  insertMessage(model: ChatMessageModel): Promise<void>{
    throw new Error("Not implemented");
  }
}