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

  const bulkProcessProcessCommand = new Message({
    id: '4e260c91-cce8-4500-8639-214b84c64fa6',
    type: 'Process',
    streamName: 'bulkProcessor:command-417e4705aee1415f8583243b8c403af3-12345',
    data: {
      vehicles: [
        {
          make: 'mini',
          model: 'Cooper S Clubman',
          status: 'active',
          vin: 'WMWLV7C06R2U29581',
        }
      ]
    },
    metadata: {
      traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    },
  });

  const bulkProcessProcessProcessingEvent = new Message({
    id: 'a4675d2e-ef6e-4929-a84a-ca6959956468',
    type: 'Processing',
    streamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
    data: {
      vehicles: [
        {
          make: 'mini',
          model: 'Cooper S Clubman',
          status: 'active',
          vin: 'WMWLV7C06R2U29581',
        }
      ],
    },
    metadata: {
      traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
      causationMessageGlobalPosition: 1,
      causationMessagePosition: 0,
      causationMessageStreamName: 'bulkProcessor:command-417e4705aee1415f8583243b8c403af3-12345',
    },
  });

  const pipelineProcessCommand = new Message({
    id: '1df3dbd0-2b9c-4e1d-8523-fe9cc48f3682',
    type: 'Process',
    streamName: 'pipeline:command-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
    data: {
      make: 'mini',
      model: 'Cooper S Clubman',
      status: 'active',
      vin: 'WMWLV7C06R2U29581',
    },
    metadata: {
      traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
      causationMessageGlobalPosition: 2,
      causationMessagePosition: 0,
      causationMessageStreamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
    },
  });

  const pipelineProcessingEvent = new Message({
    id: 'ded24348-5c84-4b4b-8b03-092e9d446096',
    type: 'Processing',
    streamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
    data: {
      make: 'mini',
      model: 'Cooper S Clubman',
      status: 'active',
      vin: 'WMWLV7C06R2U29581',
    },
    metadata: {
      traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
      causationMessageGlobalPosition: 3,
      causationMessagePosition: 0,
      causationMessageStreamName: 'pipeline:command-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
    },
  });

  const pipelineVinValidatedEvent = new Message({
    id: 'a2eeea61-bdf5-44d1-8a08-5583ee3f84c2',
    type: 'VinValidated',
    streamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
    data: {
      validationLogicVersion: 1
    },
    metadata: {
      traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
      causationMessageGlobalPosition: 4,
      causationMessagePosition: 1,
      causationMessageStreamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
    },
  });

  const messages = [
    bulkProcessProcessCommand,
    bulkProcessProcessProcessingEvent,
    pipelineProcessCommand,
    pipelineProcessingEvent,
    pipelineVinValidatedEvent,
  ];

  for (let i = 0; i < messages.length; i++) {
    await writer.write(messages[i]);
  }

  const result = await writer.db.query('select count(*) from messages;', []);
  console.log(result.rows);
};

write();
