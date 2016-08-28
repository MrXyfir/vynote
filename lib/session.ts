import * as redis from "redis";

const config = require("config");

// Set global Redis client pool
if (global.__redis === undefined) {
    global.__redis = require("sol-redis-pool")(
        config.database.redis, config.database.redisPool
    );
}

export module session {

    // Returns the entire session object or empty object
    export function get(id: string, fn: Function) {
        if (config.environment.type == "dev") {
            fn({ uid: 1, subscription: Date.now() + (60 * 60 * 1000) });
            return;
        }
        
        id = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.get(id, (err, value) => {
                global.__redis.release(redis);

                // Return session object or empty object
                fn(!!err || !value ? {} : JSON.parse(value));
            });
        });
    }

    // Saves the entire session object
    export function save(id: string, value: any) {
        value = JSON.stringify(value);
        id    = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.set(id, value, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    }

    // Deletes the session id
    export function destroy(id: string) {
        id = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.del(id, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    }
    
}