import { BuildStatus } from './buildStatus';

export interface BuildModel { 
    id: string;
    configurationId: string;
    buildNumber: number;
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
    status: BuildStatus;
    start?: Date;
    duration?: number;
}