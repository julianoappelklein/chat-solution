import * as React from 'react';
import { appStore } from '../appStore';

export class Login extends React.Component<{}, {}>{

  private nameInputRef = React.createRef<HTMLInputElement>();
  private passwordInputRef = React.createRef<HTMLInputElement>();

  handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const username = this.nameInputRef.current?.value ?? "";
    const password = this.passwordInputRef.current?.value ?? "";
    if (!username || !password) {
      alert("Please fill in all required fields");
    }
    appStore.authenticate({
      username,
      password,
    });
  }

  render() {
    return (<div className="box" style={{ minWidth: '300px', maxWidth: '90vw' }}>
      <h1 className="box-title">Login</h1>
      <div className="box-content">
        <form onSubmit={this.handleSubmit}>
          <div className="form-control-group">
            <label>Username</label>
            <input className="fill-width" type="text" ref={this.nameInputRef} />
          </div>
          <div className="form-control-group">
            <label>Password</label>
            <input className="fill-width" type="password" ref={this.passwordInputRef} />
          </div>
          <div className="form-control-group">
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>);
  }
}