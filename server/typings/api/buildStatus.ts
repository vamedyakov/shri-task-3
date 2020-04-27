export type BuildStatus = 'Waiting' | 'InProgress' | 'Success' | 'Fail' | 'Canceled';

export const BuildStatus = {
    Waiting: 'Waiting' as BuildStatus,
    InProgress: 'InProgress' as BuildStatus,
    Success: 'Success' as BuildStatus,
    Fail: 'Fail' as BuildStatus,
    Canceled: 'Canceled' as BuildStatus
};