import {
  SETTINGS_SAVED,
  SETTINGS_SUBMIT_FORM
} from '../constants/actionTypes';

const defaultState = {
  inProgress: false,
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case SETTINGS_SAVED:
      return {
        ...state,
        inProgress: false,
      };
    case SETTINGS_SUBMIT_FORM:
      return {
        ...state,
        inProgress: true,
      };
    default:
      return state;
  }
};
