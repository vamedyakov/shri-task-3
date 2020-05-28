import {actionTypes} from '../constants/actionTypes';

interface settingsActions {
  type: actionTypes,
}

export default (state = {}, action: settingsActions) => {
  switch (action.type) {
    case 'HOME_PAGE_LOADED':
      return {
        ...state,
      };
    case 'HOME_PAGE_UNLOADED':
      return {};
    default:
      return state;
  }
};
