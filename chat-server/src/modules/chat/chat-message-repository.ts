import { ChatMessageModel } from "./chat-message-model";

export interface ChatMessageRepository{
  getLastChatRoomMessages(chatRoomId: String): Promise<ChatMessageModel[]>;
  insertMessage(model: ChatMessageModel): Promise<void>;
}