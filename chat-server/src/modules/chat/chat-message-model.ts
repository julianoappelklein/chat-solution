interface ChatMessageModelData{
  id?: number;
  username: string;
  chatRoomId: string;
  message: string;
  createdOn: Date;
}

export class ChatMessageModel{
  private _data: ChatMessageModelData;

  getData(){
    return this._data;
  }
  
  constructor(data: ChatMessageModelData){
    this._data = data;
  }

  getUsername(){
    return this._data.username;
  }

  getMessage(){
    return this._data.message;
  }

  getCreatedOn(){
    return this._data.createdOn;
  }
}