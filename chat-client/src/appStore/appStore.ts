import { AppState } from "./appState";
import { AppView } from "../appView";
import { ChatAPI } from "../api/chat-api";
import { AuthenticationAPI } from "../api/authentication-api";

interface Listener {
  setState: (state: any) => void;
}

class AppStore {
  state: AppState = {
    view: { name: "login" },
    availableChatRooms: [],
    loadedMessages: [],
    authenticatedUser: null,
  };
  private _listeners: Array<Listener> = [];
  private _chatAPI = new ChatAPI();
  private _authenticationAPI = new AuthenticationAPI();

  constructor() {
    //listening to chat events
    const chat = this._chatAPI;

    chat.onWelcome((data) => {
      this._setState((state) => ({
        ...state,
        availableChatRooms: data.chatRooms,
      }));
    });

    chat.onChatMessage((data) => {
      this._setState((state) => ({
        ...state,
        loadedMessages: [...state.loadedMessages, ...[data]].slice(-50),
      }));
    });

    chat.onInvalidMessage((data) => {
      alert(data.message);
    });

    chat.onChatRoomWelcome((data) => {
      this._setState((state) => ({
        ...state,
        loadedMessages: data.messages,
        currentRoomName: data.room,
        view: {
          name: "chat",
        },
      }));
    });

    chat.onForceDisconnect(() => {
      this._setState((state) => ({
        ...state,
        view: {
          name: "login",
        },
        authenticatedUser: null,
      }));
      localStorage.removeItem("token");
    });

    const token = window.localStorage.getItem("token");
    if (token != null) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        this._chatAPI.connect();
        this._setState((state) => ({
          ...state,
          authenticatedUser: userData.username,
          view: {
            name: "chats",
          },
        }));
      } catch (e) {
        window.localStorage.removeItem("token");
      }
    }
  }

  private _setState(fn: (appState: AppState) => AppState) {
    this.state = fn(this.state);
    this._listeners.forEach((l) => {
      l.setState({});
    });
  }

  // listeners registration
  addListener(listener: Listener): void {
    const index = this._listeners.indexOf(listener);
    if (index === -1) this._listeners.push(listener);
    else this._listeners[index] = listener;
  }

  removeListener(listener: Listener): void {
    this._listeners = this._listeners.filter((x) => x !== listener);
  }

  // ROUTING
  setView(view: AppView): void {
    this._setState((state) => {
      return {
        ...state,
        view,
      };
    });
  }

  getView(): AppView {
    return this.state.view;
  }

  // ACTIONS

  //chat
  sendMessage(message: string) {
    this._chatAPI.emitChatMessage({ message });
  }

  joinChatRoom(room: string) {
    this._chatAPI.emitJoinChatRoom({ room });
  }

  //authentication
  async signOut(){
    this._chatAPI.disconnect();
    this._setState((state) => ({
      ...state,
      view: { name: "login" },
      authenticatedUser: null,
    }));
  }

  async authenticate(data: {
    username: string;
    password: string;
  }): Promise<void> {
    const token = await this._authenticationAPI.authenticate(data);
    if (token != null) {
      this._chatAPI.connect();
      localStorage.setItem("token", token);
      this._setState((state) => ({
        ...state,
        view: { name: "chats" },
        authenticatedUser: data.username,
      }));
    } else {
      alert("Credentials does not match.");
    }
  }
}

export const appStore = new AppStore();
