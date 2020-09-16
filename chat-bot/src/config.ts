import { readFileSync } from "fs";
import { join, resolve } from "path";

interface Config {
  rabbitMQConnection: {
    hostname: string;
    password: string;
    username: string;
    port: number;
  };
}

function _parseConfig<T>(
  mode: string = "dev",
  validate: (cfg: T) => boolean
): T {
  console.log(`Starting app using "${mode}".`);
  const appRoot = resolve(__dirname);
  const configString = readFileSync(
    join(appRoot, "..", `config.${mode ?? "dev"}.json`),
    "utf8"
  );
  const config = JSON.parse(configString);
  if (validate(config)) {
    return config;
  }
  console.error("INVALID CONFIGURATION");
  throw new Error("INVALID CONFIGURATION");
}

export function parseConfig() {
  return _parseConfig<Config>(process.env.NODE_ENV as any, (cfg) => {
    return (
      cfg.rabbitMQConnection != null &&
      typeof cfg.rabbitMQConnection.hostname == "string" &&
      typeof cfg.rabbitMQConnection.password == "string" &&
      typeof cfg.rabbitMQConnection.port == "number" &&
      typeof cfg.rabbitMQConnection.username == "string"
    );
  });
}
