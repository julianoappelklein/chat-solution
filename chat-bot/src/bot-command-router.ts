export interface BotCommandResult {
  data?: any;
  error?: {
    message: string;
    type: string;
  };
  headers?: any;
}

export interface BotCommand {
  data?: any;
  headers?: any;
}

export interface BotCommandExecutor {
  match(message: BotCommand): boolean;
  execute(message: BotCommand): Promise<BotCommandResult>;
}

export class BotCommandRouter {
  private _executors: BotCommandExecutor[];

  constructor(config: { executors: BotCommandExecutor[] }) {
    this._executors = config.executors;
  }

  async runCommandSafe(commandStr: string): Promise<BotCommandResult> {
    let commandResult: BotCommandResult | undefined;
    const command: BotCommand = JSON.parse(commandStr);
    try {
      for (let i = 0; i < this._executors.length; i++) {
        const executor = this._executors[i];
        if (executor.match(command)) {
          commandResult = await executor.execute(command);
          commandResult.headers = commandResult.headers ?? command.headers;
        }
      }
    } catch (ex) {
      commandResult = {
        headers: command.headers,
        error: {
          message: "An unexpected error ocurred while running your query.",
          type: "unexpected-error",
        },
      };
    }
    return (
      commandResult ?? {
        headers: command.headers,
        error: {
          message: "Sorry, we could not understand your query.",
          type: "query-unrecognized",
        },
      }
    );
  }
}
