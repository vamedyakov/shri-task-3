import {actionTypes} from '../constants/actionTypes';
import {
    ConfigurationModel
} from '../typings/api/models';

export interface initialStateCommon {
    appLoaded: boolean;
    userConfig: ConfigurationModel;
}

export const defaultStateCommon: initialStateCommon = {
    appLoaded: false,
    userConfig: {
        id: '',
        repoName: '',
        buildCommand: '',
        mainBranch: '',
        period: 1
    }
};

interface commonActions {
    type: actionTypes,
    appLoaded: boolean,
    userConf: ConfigurationModel;
}

export default (state = defaultStateCommon, action: commonActions) => {
    switch (action.type) {
        case 'APP_LOAD':
            return {
                ...state,
                appLoaded: true,
                userConfig: (action.userConf && Object.keys(action.userConf).length > 0) ? action.userConf : defaultStateCommon.userConfig
            };
        default:
            return state;
    }
};
