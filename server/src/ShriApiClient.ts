import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {Api} from "../utils/api";
import {apiConfig} from "./apiConfig"

import {
    BuildModelArrayHomeworkApiResponse,
    BuildModelHomeworkApiResponse,
    BuildRequestResultModelHomeworkApiResponse,
    CancelBuildInput,
    FinishBuildInput,
    QueueBuildInput,
    StartBuildInput,
    ConfigurationInput,
    ConfigurationModelHomeworkApiResponse
} from '../typings/api/models';

class ShriApiClient extends Api {

    constructor(config: AxiosRequestConfig) {
        super(config);
    }

    public getBuildList(offset?: number, limit?: number): Promise<BuildModelArrayHomeworkApiResponse> {
        return this.get<BuildModelArrayHomeworkApiResponse>(`/build/list`, {params: {offset, limit}})
            .then((response: AxiosResponse<BuildModelArrayHomeworkApiResponse>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async getBuildLog(buildId: string): Promise<string> {
        return this.get<string>(`/build/log`, {params: {buildId}})
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async getBuildDetails(buildId: string): Promise<BuildModelHomeworkApiResponse> {
        return this.get<BuildModelHomeworkApiResponse>(`/build/details`, {params: {buildId}})
            .then((response: AxiosResponse<BuildModelHomeworkApiResponse>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async postBuildRequest(body: QueueBuildInput): Promise<BuildRequestResultModelHomeworkApiResponse> {
        return this.post<BuildRequestResultModelHomeworkApiResponse>(`/build/request`, JSON.stringify(body))
            .then((response: AxiosResponse<BuildRequestResultModelHomeworkApiResponse>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async postBuildStart(body: StartBuildInput): Promise<string> {
        return this.post<string>(`/build/start`, JSON.stringify(body))
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async postBuildFinish(body: FinishBuildInput): Promise<string> {
        return this.post<string>(`/build/finish`, JSON.stringify(body))
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async postBuildCancel(body: CancelBuildInput): Promise<string> {
        return this.post<string>(`/build/cancel`, JSON.stringify(body))
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async getConf(): Promise<ConfigurationModelHomeworkApiResponse> {
        return this.get<ConfigurationModelHomeworkApiResponse>(`/conf`)
            .then((response: AxiosResponse<ConfigurationModelHomeworkApiResponse>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async postConf(body: ConfigurationInput): Promise<string> {
        return this.post<string>(`/conf`, JSON.stringify(body))
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    async deleteConf(): Promise<string> {
        return this.delete<string>(`/conf`)
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }
}


const instance = new ShriApiClient(apiConfig);

export = instance;