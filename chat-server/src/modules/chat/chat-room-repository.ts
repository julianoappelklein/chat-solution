import { ChatRoomModel } from "./chat-room-model";

export interface ChatRoomRepository{
  listRoomsAvailable(): Promise<ChatRoomModel[]>;
}