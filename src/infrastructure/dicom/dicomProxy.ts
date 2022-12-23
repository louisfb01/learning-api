import axios, { AxiosRequestConfig } from 'axios';

const qido = axios.create({
    baseURL: process.env.CODA_DICOM_STORE_URL + '/dicom-web/'
    //baseURL : "https://demo.orthanc-server.com/dicom-web/"
});

const wado = axios.create({
    baseURL: process.env.CODA_DICOM_STORE_URL
    //baseURL : "https://demo.orthanc-server.com/"
});

const client = {
    id: process.env.CODA_LEARNING_API_DICOM_STORE_CLIENT_ID,
    secret: process.env.CODA_LEARNING_API_DICOM_STORE_CLIENT_SECRET
}

const authEncoded = Buffer.from(`${client.id}:${client.secret}`).toString('base64');
const axiosConfig: AxiosRequestConfig = {
    headers: {
        'Authorization': `Basic ${authEncoded}`
    }
};

async function getStudyUID(SeriesUID: string): Promise<any> {
    try {
        const response = await qido.get(`/series?SeriesInstanceUID=${SeriesUID}&includefield=0020000D`,
            axiosConfig);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify({ error: error.response.data })
        throw error
    }
}

async function getInstanceUID(seriesUID: string, studyUID: string): Promise<any> {
    try {
        const response = await qido.get(`studies/${studyUID}/series/${seriesUID}/instances?includefield=00080018`,
            axiosConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify({ error: error.response.data })
        throw error
    }
}

async function getInstanceFrame(url: string): Promise<any> {
    try {
        const response = await wado.get(`wado?objectUID=${url}&requestType=WADO`,
            {
                responseType: 'arraybuffer', headers: {
                    'Authorization': `Basic ${authEncoded}`
                }
            });
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify({ error: error.response.data })
        throw error
    }
}

async function getAllStudies(): Promise<any> {
    try {
        const response = await qido.get(`studies?includefield=0020000D`,
            axiosConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify({ error: error.response.data })
        throw error
    }
}

async function getAllSeries(url: string): Promise<any> {
    try {
        const response = await qido.get(`studies/${url}/series?includefield=0020000E`,
            axiosConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response)
            error.message = JSON.stringify({ error: error.response.data })
        throw error
    }
}

export default {
    getInstanceUID, getInstanceFrame, getStudyUID, getAllStudies, getAllSeries
}