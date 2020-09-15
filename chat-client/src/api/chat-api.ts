import io from "socket.io-client";

interface OnWelcome {
  chatRooms: Array<{
    id: string;
    description: string;
  }>;
}

interface OnChatWelcome {
  room: string;
  messages: Array<{
    username: string;
    message: string;
    timestamp: string;
  }>;
}

interface OnChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

interface OnInvalidMessage {
  message: string;
}

interface OnUnexpectedError {
  message: string;
}

export class ChatAPI {
  private _socket = io({ autoConnect: false, path: "/chat", port: "3001" });

  private _withToken(data: any){
    const token = localStorage.getItem("token");
    if(token){
      data.token = token;
    }
    return data;
  }

  connect() {
    this._socket.connect();
    localStorage.debug = "*";
    this._socket.emit("hello");
  }

  onWelcome(handler: (data: OnWelcome) => void) {
    this._socket.on("welcome", handler as any);
  }

  onInvalidMessage(handler: (data: OnInvalidMessage) => void) {
    this._socket.on("invalid-message", handler as any);
  }

  onChatRoomWelcome(handler: (data: OnChatWelcome) => void) {
    this._socket.on("chat-room-welcome", handler as any);
  }

  onChatMessage(handler: (data: OnChatMessage) => void) {
    this._socket.on("chat-message", handler as any);
  }

  onUnexpectedError(handler: (data: OnUnexpectedError) => void){
    this._socket.on("unexpected-error", handler as any);
  }

  onForceDisconnect(handler: () => void) {
    this._socket.on("force-disconnect", handler as any);
  }

  emitChatMessage(data: {message: string}) {
    this._socket.emit("chat-message", this._withToken(data));
  }

  emitJoinChatRoom(data: {room: string}) {
    this._socket.emit("join-chat-room", this._withToken(data));
  }

  disconnect() {
    if (this._socket.connected) {
      this._socket.disconnect();
    }
  }
}
