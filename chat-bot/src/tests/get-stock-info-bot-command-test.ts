import { StockClient } from './../stock-client';
import { expect, assert } from 'chai';
import { CSVReader } from '../csv-reader';
import axios from 'axios';
import { GetStockInfoBotCommand } from '../bot-commands/get-stock-info';

describe('GetStockInfoBotCommandTest', () => {

  var client = new StockClient({
    axios,
    csvReader: new CSVReader()}
  );

  client.getStockInfo = async (a)=>{
    return null;
  }

  const command = new GetStockInfoBotCommand({stockClient: client});

  it('should match /stock=aapl.us', async () => {
    const result = command.match("/stock=aapl.us");
    assert.equal(result, true);
  });

  it('should match /STOCK=aapl.us', async () => {
    const result = command.match("/STOCK=aapl.us");
    assert.equal(result, true);
  });

  it('should not match /stock-aapl.us', async () => {
    const result = command.match("/stock-aapl.us");
    assert.equal(result, false);
  });

});