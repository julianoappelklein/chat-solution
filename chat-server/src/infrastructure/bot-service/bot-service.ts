export interface BotCommand {
  data: string;
  headers: any;
}

export interface BotCommandResult {
  data?: any;
  headers?: any;
  error?: {
    type: string;
    message: string;
  };
}

export interface BotService {
  enqueueCommand(command: BotCommand): void;
  setCommandResultHandler(handler: (result: BotCommandResult) => void): void;
}
