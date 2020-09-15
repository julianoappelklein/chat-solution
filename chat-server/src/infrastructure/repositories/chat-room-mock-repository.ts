import { ChatRoomModel } from "../../modules/chat/chat-room-model";
import { ChatRoomRepository } from "../../modules/chat/chat-room-repository";

export class ChatRoomMockRepository implements ChatRoomRepository{
  listRoomsAvailable(): Promise<ChatRoomModel[]>{
    return Promise.resolve([
      new ChatRoomModel({ id: "general", description: "Chat about anything you like." }),
      new ChatRoomModel({ id: "superheros", description: "Chat about Marvel or DC superheros."}),
    ]);
  }
}