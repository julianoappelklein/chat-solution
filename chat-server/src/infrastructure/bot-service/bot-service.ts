export interface BotCommand{
  command: string;
  headers: any;
}

export interface BotCommandResult{
  result: any;
  headers: any;
}

export interface BotService{
  enqueueCommand(command: BotCommand): void;
  setCommandResultHandler(handler: (result: BotCommandResult) => void): void;
}