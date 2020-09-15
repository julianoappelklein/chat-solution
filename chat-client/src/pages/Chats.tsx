import * as React from 'react';
import { appStore } from '../appStore';

export class Chats extends React.Component<{}, {}>{

  handleRoomClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    appStore.joinChatRoom(e.currentTarget.dataset.room as string);
  }

  render() {
    return (<div className="box" style={{ minWidth: '300px', maxWidth: '90vw' }}>
      <h1 className="box-title">Available Chat Rooms</h1>
      <div className="box-content">
        <ul className="box-list">
          {appStore.state.availableChatRooms.map(x => (
            <li key={x.id}>
              <a onClick={this.handleRoomClick} data-room={x.id}>{x.id}<br /><small>{x.description}</small></a>
            </li>
          ))}
        </ul>
        <button onClick={() => appStore.signOut()}>Sign Out</button>
      </div>
    </div>);
  }
}