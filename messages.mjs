import { randomUUID as uuid } from 'crypto';
import {
  Message,
} from 'message-db-connector';

const bulkProcessProcessCommand_0 = new Message({
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
      },
      {
        make: 'Subaru',
        model: 'Outback',
        status: 'active',
        vin: '4S4BTGND2M3104669',
      },
    ]
  },
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
  },
});

const bulkProcessProcessProcessingEvent_1 = new Message({
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
      },
      {
        make: 'Subaru',
        model: 'Outback',
        status: 'active',
        vin: '4S4BTGND2M3104669',
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

const pipelineProcessCommand_2 = new Message({
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

const pipelineProcessingEvent_3 = new Message({
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

const pipelineProcessCommand_4 = new Message({
  id: 'aa883008-b5c8-4b86-a6de-bc45c4409110',
  type: 'Process',
  streamName: 'pipeline:command-417e4705aee1415f8583243b8c403af3-12345-4S4BTGND2M3104669',
  data: {
    make: 'Subaru',
    model: 'Outback',
    status: 'active',
    vin: '4S4BTGND2M3104669',
  },
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    causationMessageGlobalPosition: 2,
    causationMessagePosition: 0,
    causationMessageStreamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
  },
});

const pipelineProcessingEvent_5 = new Message({
  id: '9e83684a-5b8a-45b8-84a2-d062e51a86e9',
  type: 'Processing',
  streamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-4S4BTGND2M3104669',
  data: {
    make: 'Subaru',
    model: 'Outback',
    status: 'active',
    vin: '4S4BTGND2M3104669',
  },
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    causationMessageGlobalPosition: 5,
    causationMessagePosition: 0,
    causationMessageStreamName: 'pipeline:command-417e4705aee1415f8583243b8c403af3-12345-4S4BTGND2M3104669',
  },
});

const vehicleProcessed1_6 = new Message({
  id: '79b8925a-bd9b-41e0-a8e7-689e2fb5538f',
  type: 'VehicleProcessed',
  streamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
  data: {
    vin: 'WMWLV7C06R2U29581'
  },
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    causationMessageGlobalPosition: 4,
    causationMessagePosition: 0,
    causationMessageStreamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-WMWLV7C06R2U29581',
  }
});

const vehicleProcessed1_7 = new Message({
  id: '5065b2d5-b9a4-42cc-9ab3-e8139c224f49',
  type: 'VehicleProcessed',
  streamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
  data: {
    vin: '4S4BTGND2M3104669'
  },
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    causationMessageGlobalPosition: 6,
    causationMessagePosition: 0,
    causationMessageStreamName: 'pipeline-417e4705aee1415f8583243b8c403af3-12345-4S4BTGND2M3104669',
  }
});

const bulkProcessProcessedEvent_8 = new Message({
  id: '474a6efa-111c-46b4-8b99-a6794dbc2511',
  type: 'Processed',
  streamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345',
  data: {},
  metadata: {
    traceId: '04e57e34-e65a-4607-9f3b-585373883e62',
    causationMessageGlobalPosition: 8,
    causationMessagePosition: 2,
    causationMessageStreamName: 'bulkProcessor-417e4705aee1415f8583243b8c403af3-12345'
  }
});

const messages = [
  bulkProcessProcessCommand_0,
  bulkProcessProcessProcessingEvent_1,
  pipelineProcessCommand_2,
  pipelineProcessingEvent_3,
  pipelineProcessCommand_4,
  pipelineProcessingEvent_5,
  vehicleProcessed1_6,
  vehicleProcessed1_7,
  bulkProcessProcessedEvent_8,
];

export default messages;