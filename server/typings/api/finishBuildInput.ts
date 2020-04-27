export interface FinishBuildInput {
    buildId: string;
    duration: number;
    success: boolean;
    buildLog: string;
}