/**
 * The role of this file is to encapsulate all environment reading in one place
 * and pass it into all dependencies to ensure consistent values being read,
 * minimalize impact of change, and make it easier to test various components.
 */
import * as dotenv from 'dotenv';

dotenv.config();

function requireFromEnv(key) {
  if (typeof process.env[key] === 'undefined') {
    console.error(`Missing required env variable: ${key}, exiting.`);

    return process.exit(1);
  }

  return process.env[key];
}

// NOTE: 'lookupLogLevel' only exists because of the simple solution being offered
// by the message-db-connector today. This WILL go away in the future.
function lookupLogLevel(envLogLevel) {
  const loggerLookup = {
    Off: -1,
    Error: 0,
    Info: 2,
    Verbose: 4,
    Debug: 5,
  };

  if (!Object.keys(loggerLookup).some((key) => key === envLogLevel)) {
    console.error('LOG_LEVEL is not a proper value. (Off, Error, Info, Verbose, Debug)');
    process.exit(1);
  }

  return loggerLookup[envLogLevel];
}

export const env = {
  MESSAGE_DB_CONNECTION_STRING: requireFromEnv('MESSAGE_DB_CONNECTION_STRING'),
  LOG_LEVEL: lookupLogLevel(requireFromEnv('LOG_LEVEL')),
};
