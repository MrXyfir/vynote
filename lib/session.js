const redis = require("redis");

const config = require("config");

// Set global Redis client pool
if (global.__redis === undefined) {
    global.__redis = require("sol-redis-pool")(
        config.database.redis, config.database.redisPool
    );
}

module.exports = {

    // Returns the entire session object or empty object
    get: function(id, fn) {
        if (config.environment.type == "dev") {
            fn({
                uid: 1, subscription: Date.now() + ((60 * 60 * 24) * 1000)
            }); return;
        }
        id = id.split('#')[1];

        global.__redis.acquire((err, redis) => {
            redis.get(id, (err, value) => {
                global.__redis.release(redis);

                // Return session object or empty object
                fn(!!err || !value ? {} : JSON.parse(value));
            });
        });
    },

    // Saves the entire session object
    save: function(id, value) {
        value = JSON.stringify(value);
        id    = id.split('#')[1];

        global.__redis.acquire((err, redis) => {
            redis.set(id, value, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    },

    // Deletes the session id
    destroy: function(id) {
        id = id.split('#')[1];

        global.__redis.acquire((err, redis) => {
            redis.del(id, (err, reply) => {
                global.__redis.release(redis);
            });
        });

    }
    
}