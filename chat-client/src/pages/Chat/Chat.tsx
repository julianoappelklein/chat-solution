import './Chat.css';
import * as React from 'react';
import { appStore } from '../../appStore';
import { relative } from 'path';

export class Chat extends React.Component<{}, { isCommand: boolean }>{

  state = {
    isCommand: false
  };

  private messageInputRef = React.createRef<HTMLTextAreaElement>();
  private chatMessagesRef = React.createRef<HTMLDivElement>();

  handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    this.submit();
  }

  componentDidMount() {
    this.tryScroll()
  }

  componentDidUpdate() {
    this.tryScroll()
  }

  private tryScroll() {
    if (this.chatMessagesRef.current) {
      this.chatMessagesRef.current.scrollTop = this.chatMessagesRef.current.scrollHeight;
    }
  }

  submit() {
    const message = this.messageInputRef.current?.value ?? "";
    appStore.sendMessage(message);
    if (this.messageInputRef.current) this.messageInputRef.current.value = "";
    this.setState({ isCommand: false });
  }

  handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    const isCommand = (value ?? "" as string).startsWith('/');
    if (this.state.isCommand !== isCommand) {
      this.setState({ isCommand });
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      setTimeout(() => {
        this.submit();
      }, 10);

    }
  }

  private padZ(v: any, l: number){
    return (v.toString() as String).padStart(l,"0");
  }

  private formatDate(date: any){
    const dateObj: Date = typeof date === "string" ? new Date(date) : date;
    return `${this.padZ(dateObj.getHours(), 2)}:${this.padZ(dateObj.getMinutes(),2)} (${this.padZ(dateObj.getDate(),2)}-${this.padZ(dateObj.getMonth(),2)})`;
  }

  render() {
    return (
      <div className="Chat-container">
        <button style={{ position: 'absolute', left: 10, top: -40, zIndex: 2 }} onClick={() => appStore.setView({ name: "chats" })}>Leave Room</button>
        <div className="Chat-messages" ref={this.chatMessagesRef}>
          {appStore.state.loadedMessages.map((x, i) => (
            <div key={i} className={`Chat-message ${appStore.state.authenticatedUser === x.username ? "Chat-message-alternate" : ""}`}>
              <div className="Chat-message-content">
                <div className="Chat-message-label">{x.username}</div>
                <div className="Chat-message-body">{x.message}</div>
                <div className="Chat-message-timestamp">{this.formatDate(x.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={`Chat-input ${this.state.isCommand ? "Chat-input-command" : ""}`}>
          <form onSubmit={this.handleSubmit}>
            <textarea placeholder="Press CTRL + Enter to send your message" onKeyDown={this.handleKeyDown} ref={this.messageInputRef} onChange={this.handleMessageChange}>

            </textarea>
            <button style={{ marginTop: 10 }}>Send</button> <small style={{color: 'gray'}}> as {appStore.state.authenticatedUser}</small>
          </form>
        </div>

      </div>);
  }
}