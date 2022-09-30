import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.CODA_LEARNING_API_AIDBOX_URL
});

const client = {
    id: process.env.CODA_LEARNING_API_CLIENT_ID,
    secret: process.env.CODA_LEARNING_API_CLIENT_SECRET
}

const authEncoded = Buffer.from(`${client.id}:${client.secret}`).toString('base64');
const axiosConfig = {
    headers: {
        'Authorization': `Basic ${authEncoded}`
    }
};

async function executeQuery(query: string): Promise<any> {
    try {
        console.log(query)
        const response = await instance.post('$sql?_format=json',
            [query],
            axiosConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify(error.response.data)
        return error
    }
}

export default {
    executeQuery
}