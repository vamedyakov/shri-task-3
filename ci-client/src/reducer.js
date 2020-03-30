import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import settings from './reducers/settings';
import history from './reducers/history';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  common,
  home,
  settings,
  history,
  router: routerReducer
});
