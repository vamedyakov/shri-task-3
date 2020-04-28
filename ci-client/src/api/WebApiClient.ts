import {AxiosError, AxiosResponse} from "axios";
import {Api} from "../utils/api";
import {apiConfig} from "./apiConfig"

import {
    ConfigurationModel,
    BuildModel,
    BuildRequestResultModel,
    ConfigurationInput,
} from '../typings/api/models';

class WebApiClient extends Api {

    getSettings(): Promise<ConfigurationModel> {
        return this.get<ConfigurationModel>(`/settings`)
            .then((response: AxiosResponse<ConfigurationModel>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    postSettings(body: ConfigurationInput): Promise<string> {
        return this.post<string>(`/settings`, body)
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    getBuilds(offset?: number, limit?: number): Promise<Array<BuildModel>> {
        return this.get<Array<BuildModel>>(`/builds`, {params: {offset, limit}})
            .then((response: AxiosResponse<Array<BuildModel>>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    getBuildByID(buildId: string): Promise<BuildModel> {
        return this.get<BuildModel>(`/builds/${buildId}`)
            .then((response: AxiosResponse<BuildModel>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    getBuildLogByID(buildId: string): Promise<string> {
        return this.get<string>(`/builds/${buildId}/logs`)
            .then((response: AxiosResponse<string>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    postAddBuildQueue(buildId: string): Promise<BuildRequestResultModel> {
        return this.post<BuildRequestResultModel>(`/builds/${buildId}`)
            .then((response: AxiosResponse<BuildRequestResultModel>) => {
                const {data} = response;

                return data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

}

const instance = new WebApiClient(apiConfig);

export default instance;