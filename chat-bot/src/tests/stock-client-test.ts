import { StockClient } from './../stock-client';
import { assert } from 'chai';
import { describe, it } from 'mocha';
import { CSVReader } from '../csv-reader';
import axios from 'axios';

describe('StockClient', () => {

  var client = new StockClient({
    axios,
    csvReader: new CSVReader()}
  );

  it('should return data for aapl.us', async () => {
    const result = await client.getStockInfo({stockId: "aapl.us"})
    assert.isNotNull(result);
  });

  it('should return data for superfakestock', async () => {
    const result = await client.getStockInfo({stockId: "superfakestock"})
    assert.isNotNull(result);
  });
});