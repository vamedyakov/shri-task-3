import {
  APP_LOAD,
  REDIRECT,
  DETAILS_PAGE_LOADED
} from '../constants/actionTypes';

const defaultState = {
  userConfig: {
    repoName: '',
    buildCommand: '',
    mainBranch: '',
    period: ''
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        appLoaded: true,
        userConfig: (action.userConf && Object.keys(action.userConf).length > 0) ? action.userConf : defaultState.userConfig
      };
    case DETAILS_PAGE_LOADED:
      return {
        ...state,
        build: action.build ? action.build : null,
        log: action.log ? action.log : null
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    default:
      return state;
  }
};
