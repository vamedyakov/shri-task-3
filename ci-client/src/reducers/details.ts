import {actionTypes} from '../constants/actionTypes';
import {
  BuildModel
} from '../typings/api/models';

export interface initialStateDetails {
  build?: BuildModel,
  log: string;
}

interface detailsActions {
  type: actionTypes,
  build: BuildModel,
  log: string;
}

export const defaultStateDetails: initialStateDetails = {
  log: ''
};

export default (state = defaultStateDetails, action: detailsActions) => {
  switch (action.type) {
    case 'DETAILS_PAGE_LOADED':
      return {
        ...state,
        build: action.build ? action.build : null,
        log: action.log ? action.log : ''
      };
    case 'DETAILS_PAGE_UNLOAD':
      return {
        ...state,
        build: null,
        log: ''
      };
    default:
      return state;
  }
};
