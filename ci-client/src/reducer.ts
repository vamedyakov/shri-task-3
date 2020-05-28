import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import settings from './reducers/settings';
import historyPage from './reducers/history';
import details from './reducers/details';

export default combineReducers({
  common,
  home,
  settings,
  historyPage,
  details
});
