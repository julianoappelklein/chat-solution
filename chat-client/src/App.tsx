import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { appStore } from './appStore';
import { Chat, Chats, Login } from './pages';

class App extends React.Component<{}, {}> {

  componentDidMount() {
    appStore.addListener(this);
  }

  componentWillUnmount() {
    appStore.removeListener(this);
  }

  private getView = () => {

    let viewNode: React.ReactNode;
    let view = appStore.getView();

    switch (view.name) {
      case "login":
        viewNode = (<Login />);
        break;
      case "chats":
        viewNode = (<Chats />);
        break;
      case "chat":
        viewNode = (<Chat />);
        break;
      default:
        viewNode = (<p>Not Found</p>);
    }

    return viewNode;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          Node Chat - Jobsity Challenge
      </header>
        <div className="App-main">
          {this.getView()}
        </div>
      </div>
    );
  }
}

export default App;
