/**
 *  file redis.js that contains the class RedisClient
 */
import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = false; // Start with false
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false; // Set to false on error
    });
    this.client.on('connect', () => {
      this.isClientConnected = true; // Set to true when connected
    });
  }

  // Check if Redis client is alive
  isAlive() {
    return this.isClientConnected; // Return connection status
  }

  // Ping Redis to check if it's responding
  async ping() {
    try {
      await promisify(this.client.ping).bind(this.client)();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get a key from Redis
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // Set a key-value pair in Redis with optional expiration
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  // Delete a key from Redis
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
