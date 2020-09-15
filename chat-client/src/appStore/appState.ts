import { AppView } from "../appView";

export interface ChatMessage {
  username: string;
  timestamp: string;
  message: string;
}

export interface ChatRoom {
  id: string;
  description: string;
}

export interface AppState {
  view: AppView;
  authenticatedUser: string | null;
  loadedMessages: ChatMessage[] ;
  currentRoomName?: string;
  availableChatRooms: ChatRoom[];
}
