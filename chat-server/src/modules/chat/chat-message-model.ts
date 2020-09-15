
interface ChatMessageModelData{
  id?: number;
  userId: string;
  chatRoomId: string;
  message: string;
  createdOn: Date;
}

export class ChatMessageModel{
  _data: ChatMessageModelData;
  constructor(data: ChatMessageModelData){
    this._data = data;
  }

  
}