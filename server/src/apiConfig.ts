import https from "https";

export const apiConfig = {
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.SHRI_AUTH_TOKEN}`,
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true,
    }),
}