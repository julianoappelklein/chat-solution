import { AppState } from "./appState";
import { AppView } from "../appView";
import { ChatAPI } from "../api/chat-api";
import { AuthenticationAPI } from "../api/authentication-api";

interface Listener {
  setState: (state: any) => void;
}

class AppStore {
  private _state: AppState = {
    view: { name: "login" },
    availableChatRooms: [],
    loadedMessages: [],
  };
  private _listeners: Array<Listener> = [];
  private _chatAPI = new ChatAPI();
  private _authenticationAPI = new AuthenticationAPI();

  constructor() {
    this._chatAPI.onWelcome((data) => {
      alert("Welcome!");
    });
  }

  //listeners
  private _changeState(fn: (appState: AppState) => AppState) {
    this._state = fn(this._state);
    this._listeners.forEach((l) => {
      l.setState({});
    });
  }

  addListener(listener: Listener): void {
    const index = this._listeners.indexOf(listener);
    if (index === -1) this._listeners.push(listener);
    else this._listeners[index] = listener;
  }

  removeListener(listener: Listener): void {
    this._listeners = this._listeners.filter((x) => x !== listener);
  }

  //authentication

  async authenticate(data: {
    username: string;
    password: string;
  }): Promise<void> {
    const result = await this._authenticationAPI.authenticate(data);
    if (result != null) {
      this._chatAPI.connect();
      this.setView({ name: "chats" });
    }
  }

  //routing
  setView(view: AppView): void {
    this._changeState((state) => {
      return {
        ...state,
        view,
      };
    });
  }

  getView(): AppView {
    return this._state.view;
  }

  //chat
}

export const appStore = new AppStore();
