import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  Message,
  MessageDbReader,
  Levels,
} from 'message-db-connector';
import open, { openApp, apps } from 'open';

import { env } from './env.mjs';

const readerPromise = MessageDbReader.Make({
  pgConnectionConfig: {
    connectionString: env.MESSAGE_DB_CONNECTION_STRING
  },
  logLevel: Levels.Verbose,
});

function getCategory(stream) {
  return stream.substring(0, stream.indexOf('-'));
}

const categories = [];
const categoriesLookup = new Set();
const streamsLookup = {};

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true
});

// Get all the categories
fastify.route({
  method: 'GET',
  url: '/',
  handler: async (req, res) => {
    const SQL = 'SELECT DISTINCT stream_name FROM messages;'; 
    const streams = (await (await readerPromise).db.query(SQL)).rows;

    for (const { stream_name: stream } of streams) {
      const category = getCategory(stream);
      if (!categoriesLookup.has(category)) {
        categoriesLookup.add(category);
        categories.push(category);
      }

      if (!streamsLookup[category]) {
        streamsLookup[category] = {};
      }

      if (!streamsLookup[category][stream]) {
        streamsLookup[category][stream] = true;
      }
    }

    console.log(JSON.stringify(streamsLookup, null, 2));

    res.send({ categories });
  },
});

fastify.route({
  method: 'GET',
  url: '/category/:category/streams',
  handler: (req, res) => {
    console.log(req.params)
    const { params: { category } } = req;
    const streams = [];

    for (const stream of Object.keys(streamsLookup[category])) {
      streams.push(stream);
    }

    res.send({ streams });
  }
});

fastify.route({
  method: 'GET',
  url: '/stream/:stream',
  handler: async (req, res) => {
    const { params: { stream } } = req;
    const SQL = 'SELECT * FROM get_stream_messages($1)'
    const messages = (await (await readerPromise).db.query(SQL, [stream])).rows;

    console.log(JSON.stringify(messages, null, 2))

    res.send({ messages });
  },
});

fastify.route({
  method: 'GET',
  url: '/message/:id',
  handler: async (req, res) => {
    const { params: { id } } = req;
    console.log('id', id);
    const SQL = `SELECT * FROM messages WHERE id = '${id}'`;
    const message = (await (await readerPromise).db.query(SQL)).rows[0];

    console.log(message);

    res.send({ message });
  }
});

fastify.listen({ port: 8000 }, (error, address) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  console.log(address);
});

open('./index.html', {app: { name: apps.browser }});