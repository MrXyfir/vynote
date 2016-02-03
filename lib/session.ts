import * as redis from "redis";

// Set global Redis client pool
if (global.__redis === undefined) {
    let config = require("../config").database;
    global.__redis = require("sol-redis-pool")(
        config.redis, config.redisPool
    );
}

export module session {


    // Returns the entire session object or undefined
    function get(id: string, fn: Function) {

        id = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.get(id, (err, value) => {
                global.__redis.release(redis);

                // Return session object or undefined
                fn(!!err || !value ? undefined : JSON.parse(value));
            });
        });
    }

    // Saves the entire session object
    function save(id: string, value: any) {

        value = JSON.stringify(value);
        id    = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.set(id, value, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    }

    // Deletes the session id
    function destroy(id: string) {

        id = id.split('#')[1];

        global.__redis.acquire((err, redis: redis.RedisClient) => {
            redis.del(id, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    }
    
}