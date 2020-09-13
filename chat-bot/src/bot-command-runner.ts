export interface IBotCommandResult {
  data?: any;
  error?: {
    message: string;
    type: string;
  };
}

export interface IBotCommand {
  match(message: String): boolean;
  execute(message: String): Promise<IBotCommandResult>;
}

export class BotCommandRunner {
  private _commands: IBotCommand[];

  constructor(config: { commands: IBotCommand[] }) {
    this._commands = config.commands;
  }

  async runCommandSafe(message: String): Promise<IBotCommandResult> {
    let commandResult: IBotCommandResult | undefined;
    try {
      for (let i = 0; i < this._commands.length; i++) {
        const command = this._commands[i];
        if (command.match(message)) {
          commandResult = await command.execute(message);
        }
      }
    } catch (ex) {
      commandResult = {
        error: {
          message: "An unexpected error ocurred while running your query.",
          type: "unexpected-error",
        },
      };
    }
    return (
      commandResult ?? {
        error: {
          message: "Sorry, we could not understand your query.",
          type: "query-understood",
        },
      }
    );
  }
}
