export interface Logger{
  logError(err: Error): void;
}

export class ConsoleLogger{
  logError(err: Error): void{
    console.error(err);
  }
}