import { BuildStatus } from './buildStatus';

export interface BuildRequestResultModel { 
    id: string;
    buildNumber: number;
    status: BuildStatus;
}