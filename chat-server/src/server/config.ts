import { parseConfig as _parseConfig } from '../infrastructure/config';

export interface Config {
  chatServerClientPath?: string,
  rabbitMQConnection: {
    hostname: string;
    password: string;
    username: string;
    port: number;
  };
  mysqlConnection: {
    host: string,
    user: string,
    password: string,
    database: string,    
  };
}

export function parseConfig(){
  return _parseConfig<Config>(process.env.NODE_ENV as any, (cfg)=>{
    return cfg.rabbitMQConnection!=null
      && typeof cfg.rabbitMQConnection.hostname == 'string'
      && typeof cfg.rabbitMQConnection.password == 'string'
      && typeof cfg.rabbitMQConnection.port == 'number'
      && typeof cfg.rabbitMQConnection.username == 'string'
      && cfg.mysqlConnection != null
      && typeof cfg.mysqlConnection.database == 'string'
      && typeof cfg.mysqlConnection.host == 'string'
      && typeof cfg.mysqlConnection.password == 'string'
      && typeof cfg.mysqlConnection.user == 'string'
  });
}