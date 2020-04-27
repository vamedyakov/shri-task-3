export interface ConfigurationModel {
    id: string;
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;
}