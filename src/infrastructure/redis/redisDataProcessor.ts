import { commandOptions, createClient } from 'redis';
var crypto = require('crypto')

const USERNAME = process.env.CODA_LEARNING_API_REDIS_USERNAME ? process.env.CODA_LEARNING_API_REDIS_USERNAME : ''
const PASSWORD = process.env.CODA_LEARNING_API_REDIS_PASSWORD ? process.env.CODA_LEARNING_API_REDIS_PASSWORD : ''
const HOST = process.env.CODA_LEARNING_API_REDIS_HOST ? process.env.CODA_LEARNING_API_REDIS_HOST : 'localhost'
const PORT = Number(String(process.env.CODA_LEARNING_API_REDIS_PORT)) ? Number(String(process.env.CODA_LEARNING_API_REDIS_PORT)) : 6379
const client = USERNAME ? createClient({ url: `redis://${USERNAME}:${PASSWORD}@${HOST}:${PORT}` }) : createClient();
client.connect();

async function setRedisKey(result: any) {

    const redisKey = generateToken();
    await client.setEx(redisKey, 60 * 60 * 24, result); //set key expiry to 24h
    return redisKey;
}

async function setRedisJobId(result: any, jobID: string) {
    await client.setEx(jobID, 60 * 60 * 24, result)
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

async function getBuffer(key:string) {
    const dataset = await client.get(
        commandOptions({ returnBuffers: true }),
        key);
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
    getBuffer,
}