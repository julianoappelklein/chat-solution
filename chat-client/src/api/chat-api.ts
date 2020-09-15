import io from "socket.io-client";

export const onConnect = "onConnect";
export const onDisconnect = "onDisconnect";
export const onRoomEntered = "onRoomEntered";
export const onChatMessage = "onRoomEntered";

interface OnWelcome {}

interface OnChatWelcome {}

interface OnChatMessage {}

export class ChatAPI {
  private _socket = io({ autoConnect: false, path: "/chat", port: "3001" });

  connect() {
    this._socket.connect();
    this._socket.emit("hello");
  }

  onWelcome(handler: (data: OnWelcome) => void) {
    this._socket.on("welcome", handler as any);
  }

  onChatWelcome(handler: (data: OnChatWelcome) => void) {
    this._socket.on("chat-welcome", handler as any);
  }

  onChatMessage(handler: (data: OnChatMessage) => void) {
    this._socket.on("chat-message", handler as any);
  }

  emitChatMessage(data: any) {
    this._socket.emit("chat-message", data);
  }

  disconnect() {
    if (this._socket.connected) {
      this._socket.disconnect();
    }
  }
}
