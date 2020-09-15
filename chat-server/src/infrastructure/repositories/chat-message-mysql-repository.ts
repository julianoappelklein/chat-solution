import { ChatMessageRepository } from "../../modules/chat/chat-message-repository";
import { ChatMessageModel } from "../../modules/chat/chat-message-model";
import { Pool } from "mysql";

export class ChatMessageMySqlRepository implements ChatMessageRepository {
  private _pool: Pool;

  constructor(config: { mysqlPool: Pool }) {
    this._pool = config.mysqlPool;
  }

  private _rowToModel = (row: any) => {
    const { id, username, chat_room_id, message, created_on } = row;
    return new ChatMessageModel({
      id: id,
      username: username,
      chatRoomId: chat_room_id,
      createdOn: created_on,
      message: message
    });
  }

  public async getLastChatRoomMessages(chatRoomId: String, limit = 50): Promise<ChatMessageModel[]> {
    const rows: any[] = await new Promise((resolve, reject) => {
      this._pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.query(
          "SELECT * FROM chat_message WHERE chat_room_id = ? ORDER BY Id DESC LIMIT ?",
          [chatRoomId, limit],
          (err, rows) => {
            connection.release();
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
    });
    rows.reverse();
    return rows.map(this._rowToModel);
  }

  insertMessage(message: ChatMessageModel): Promise<void> {
    var data = message.getData();

    return new Promise((resolve, reject) => {
      this._pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.query(
          "INSERT INTO chat_message (username, chat_room_id, message, created_on) VALUES(?, ?, ?, ?)",
          [data.username, data.chatRoomId, data.message, data.createdOn],
          (err, rows) => {
            connection.release();
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
    });
  }
}
