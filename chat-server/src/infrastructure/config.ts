import { readFileSync } from "fs";
import { join, resolve } from "path";

export function parseConfig<T>(
  mode: string = "dev",
  validate: (cfg: T) => boolean
): T {
  console.log(`Starting app using "${mode}".`);
  const appRoot = resolve(__dirname);
  const configString = readFileSync(
    join(appRoot, "../..", `config.${mode ?? "dev"}.json`),
    "utf8"
  );
  const config = JSON.parse(configString);
  if (validate(config)) {
    return config;
  }
  console.error("INVALID CONFIGURATION");
  throw new Error("INVALID CONFIGURATION");
}
