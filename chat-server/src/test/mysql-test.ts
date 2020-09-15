import { assert } from 'chai';
import { describe, it } from 'mocha';
import { serviceLocator } from '../server/service-locator';

describe('MySql', () => {
  it('should not fail', async () => {
    const r = await serviceLocator.getChatRoomRepository().listRoomsAvailable();
    assert.isNotNull(r);
  });
});