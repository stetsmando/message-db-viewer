import { randomUUID as uuid } from 'crypto';
import {
  Message,
  MessageDbWriter,
  Levels,
} from 'message-db-connector';

import { env } from './env.mjs';
import messages from './messages.mjs';

async function write() {
  const writer = await MessageDbWriter.Make({
    pgConnectionConfig: {
      connectionString: env.MESSAGE_DB_CONNECTION_STRING
    },
    logLevel: Levels.Verbose,
  });

  for (let i = 0; i < messages.length; i++) {
    await writer.write(messages[i]);
  }

  const result = await writer.db.query('select count(*) from messages;', []);
  console.log(result.rows);
};

write();
