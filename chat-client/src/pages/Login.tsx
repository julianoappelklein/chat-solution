import * as React from 'react';
import { appStore } from '../appStore';

export class Login extends React.Component<{}, {}>{

  private nameInputRef = React.createRef<HTMLInputElement>();
  private passwordInputRef = React.createRef<HTMLInputElement>();

  handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    appStore.authenticate({
      username: this.nameInputRef.current?.value ?? "",
      password: this.passwordInputRef.current?.value ?? ""
    });
  }

  render() {
    return (<div className="box">
      <h1 className="box-title">Login</h1>
      <div className="box-content">
        <form onSubmit={this.handleSubmit}>
          <div className="form-control-group">
            <label>Username</label>
            <input type="text" ref={this.nameInputRef} />
          </div>
          <div className="form-control-group">
            <label>Password</label>
            <input type="password" ref={this.passwordInputRef} />
          </div>
          <div className="form-control-group">
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>);
  }
}