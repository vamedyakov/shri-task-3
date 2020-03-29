import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  ARTICLE_SUBMITTED,
  SETTINGS_SAVED,
  LOGIN,
  REGISTER,
  DELETE_ARTICLE,
  ARTICLE_PAGE_UNLOADED,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  HISTORY_PAGE_LOADED,
  DETAILS_PAGE_LOADED
} from '../constants/actionTypes';

const defaultState = {
  appName: 'Conduit',
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
    case HISTORY_PAGE_LOADED:
      return {
        ...state,
        buildsList: action.buildsList ? action.buildsList : null
      };
    case DETAILS_PAGE_LOADED:
      return {
        ...state,
        build: action.build ? action.build : null,
        log: action.log ? action.log : null
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: '/', token: null, currentUser: null };
    case ARTICLE_SUBMITTED:
      const redirectUrl = `/article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user
      };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      };
    case DELETE_ARTICLE:
      return { ...state, redirectTo: '/' };
    case ARTICLE_PAGE_UNLOADED:
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};
