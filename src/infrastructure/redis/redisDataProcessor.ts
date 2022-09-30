import { createNodeRedisClient } from 'handy-redis';
var crypto = require('crypto')

const PASSWORD = process.env.CODA_LEARNING_API_REDIS_PASSWORD ? process.env.CODA_LEARNING_API_REDIS_PASSWORD : ''
const HOST = process.env.CODA_LEARNING_API_REDIS_HOST ? process.env.CODA_LEARNING_API_REDIS_HOST : 'localhost'
const PORT = Number(String(process.env.CODA_LEARNING_API_REDIS_PORT)) ? Number(String(process.env.CODA_LEARNING_API_REDIS_PORT)) : 6379
const client = createNodeRedisClient({ host: HOST, port: PORT, password: PASSWORD });

async function setRedisKey(result: any) {

    const redisKey = generateToken();
    console.log(redisKey);
    await client.setex(redisKey, 60 * 60 * 24, JSON.stringify(result)); //set key expiry to 24h
    return redisKey;
}

async function setRedisJobId(result: any, jobID: string) {
    await client.setex(jobID, 60 * 60 * 24, JSON.stringify(result))
    return jobID;
}

async function getRedisKey(key: string) {
    const dataset = await client.get(key);
    await client.expire(key, 60 * 60 * 24); //reset key expiry
    if (dataset === null) {
        return '{}';
    }
    else {
        return dataset;
    }
}

function generateToken() {
    return crypto.randomBytes(12).toString('base64');
}

export default {
    setRedisKey,
    getRedisKey,
    setRedisJobId,
}