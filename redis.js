const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);

client.on('ready',function() {
    console.log("Redis is ready");
});

// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});


module.exports = client;
