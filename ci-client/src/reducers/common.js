import {
  APP_LOAD,
  REDIRECT,
  DETAILS_PAGE_LOADED
} from '../constants/actionTypes';

const defaultState = {
  userConfig: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        appLoaded: true,
        userConfig: action.userConf ? action.userConf : null
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
