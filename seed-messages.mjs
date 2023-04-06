import { randomUUID as uuid } from 'crypto';
import {
  Message,
  MessageDbWriter,
  Levels,
} from 'message-db-connector';

import { env } from './env.mjs';

async function write() {
  const writer = await MessageDbWriter.Make({
    pgConnectionConfig: {
      connectionString: env.MESSAGE_DB_CONNECTION_STRING
    },
    logLevel: Levels.Verbose,
  });

  const categories = ['categoryOne', 'categoryTwo', 'categoryThree'];
  const streamsIds = [
    '7fe9848c-80f3-454e-b07c-c2bff2bbd933',
    'b886c722-6ae1-4c65-a33e-1810323667ab',
    '6a23ece8-1b9b-4057-a04f-3c02f3660924',
  ];
  const types = ['SomeType', 'AnotherType', 'ThisType', 'ThatType'];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  for (let i = 0; i < 10; i++) {
    const streamName = `${categories[getRandomInt(categories.length)]}-${streamsIds[getRandomInt(streamsIds.length)]}`;
    const type = types[getRandomInt(types.length)]

    const message = new Message({
      id: uuid({ disableEntropyCache: true }),
      type,
      streamName,
      data: {},
      metadata: {
        traceId: uuid({ disableEntropyCache: true })
      },
    });
    
    await writer.write(message);
  }

  const result = await writer.db.query('select count(*) from messages;', []);
  console.log(result.rows);
};

write();