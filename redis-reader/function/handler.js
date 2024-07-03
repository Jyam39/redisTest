'use strict';

const Redis = require('ioredis');

module.exports = async (event, context) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || '172.16.1.3',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'lJKM6cwRN4'
  });

  try {
    // クエリパラメータからキーを取得して値を読み込む
    const key = event.query.key;
    if (!key) {
      throw new Error('Key is required');
    }

    const value = await redis.get(key);
    console.log('Read successful:', value);

    redis.disconnect();

    if (value) {
      return context.status(200).succeed(`Read successful: key=${key}, value=${value}`);
    } else {
      return context.status(404).fail(`Key ${key} not found`);
    }
  } catch (err) {
    console.error('Error reading from Redis:', err);
    redis.disconnect();
    return context.status(500).fail('Error reading from Redis');
  }
};