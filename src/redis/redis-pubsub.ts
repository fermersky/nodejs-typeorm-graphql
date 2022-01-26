import redis from 'redis';

export default class RedisPubSub {
  static client: any;

  constructor() {
    RedisPubSub.client = redis.createClient({
      url: 'http://localhost:6379',
    });
  }

  static publish(event, data): void {
    this.client.publish(event, data);
  }

  static subscribe(event, cb): void {
    this.client.subscribe(event, cb);
  }
}
