import {
  BotCommand,
  BotCommandExecutor,
  BotCommandRouter,
} from "../bot-command-router";

describe("GetStockInfoBotCommandTest", () => {
  
  const neverRunExecutor: BotCommandExecutor = {
    match: (command) => true,
    execute: (command) => {
      return Promise.resolve({ headers: command.headers, data: "OK" });
    },
  };

  const alwaysOKExecutor: BotCommandExecutor = {
    match: (command) => true,
    execute: (command) => {
      return Promise.resolve({ headers: command.headers, data: "OK" });
    },
  };

  // it("should return not recognized", async () => {
  //   new BotCommandRouter({executors: []}).runCommandSafe(JSON.stringify())
  //   assert.equal(result, true);
  // });

  // it("should match /STOCK=aapl.us", async () => {
  //   const result = command.match({ data: "/STOCK=aapl.us" });
  //   assert.equal(result, true);
  // });

  // it("should not match /stock-aapl.us", async () => {
  //   const result = command.match({ data: "/stock-aapl.us" });
  //   assert.equal(result, false);
  // });
});
