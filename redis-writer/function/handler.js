'use strict';

const Redis = require('ioredis');

module.exports = async (event, context) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  });

  try {
    // リクエストボディからキーと値を取得
    const body = JSON.parse(event.body);
    const key = body.key;
    const value = body.value;

    if (!key || !value) {
      throw new Error('Key and value are required');
    }

    const result = await redis.set(key, value);
    console.log('Write successful:', result);

    redis.disconnect();

    return context
      .status(200)
      .succeed(`Write successful: key=${key}, value=${value}`);
  } catch (err) {
    console.error('Error writing to Redis:', err);
    redis.disconnect();
    return context
      .status(500)
      .fail('Error writing to Redis');
  }
};