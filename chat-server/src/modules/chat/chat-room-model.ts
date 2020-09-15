interface ChatRoomModelData {
  id: string;
  description: string;
}

export class ChatRoomModel {
  _data: ChatRoomModelData;

  constructor(data: ChatRoomModelData) {
    this._data = data;
  }

  getDescription(): string {
    return this._data.description;
  }

  getId(): string {
    return this._data.id;
  }
}
