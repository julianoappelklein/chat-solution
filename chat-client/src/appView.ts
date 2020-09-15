// Interfaces to simplify "routing"

export interface LoginView {
  name: "login"
}
export interface ChatsView {
  name: "chats"
}

export interface ChatView {
  name: "chat"
}

export type AppView = LoginView | ChatView | ChatsView;
  