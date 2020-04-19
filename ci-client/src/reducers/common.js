import {
  APP_LOAD,
  DETAILS_PAGE_LOADED
} from '../constants/actionTypes';

export const defaultStateCommon = {
  userConfig: {
    repoName: '',
    buildCommand: '',
    mainBranch: '',
    period: ''
  }
};

export default (state = defaultStateCommon, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        appLoaded: true,
        userConfig: (action.userConf && Object.keys(action.userConf).length > 0) ? action.userConf : defaultStateCommon.userConfig
      };
    case DETAILS_PAGE_LOADED:
      return {
        ...state,
        build: action.build ? action.build : null,
        log: action.log ? action.log : null
      };
    default:
      return state;
  }
};
