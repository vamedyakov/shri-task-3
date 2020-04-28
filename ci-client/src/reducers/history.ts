import {actionTypes} from '../constants/actionTypes';
import {
    BuildModel
} from '../typings/api/models';

export interface initialStateHistory {
    offset: number;
    limit: number;
    stepShow: number;
    toggle: boolean;
    hideMore: boolean;
    buildList: Array<BuildModel>;
}

export const defaultStateHistory: initialStateHistory = {
    offset: 0,
    limit: 5,
    stepShow: 5,
    toggle: false,
    hideMore: false,
    buildList: []
};

interface historyActions {
    type: actionTypes,
    buildList: Array<BuildModel>;
}

export default (state = defaultStateHistory, action: historyActions) => {
    switch (action.type) {
        case 'HISTORY_PAGE_LOADED':
            return {
                ...state,
                buildList: [...state.buildList, ...action.buildList],
                hideMore: action.buildList.length <= 0,
                offset: state.offset+state.stepShow
            };
        case 'HISTORY_SHOW_POPUP':
            return {
                ...state,
                toggle: true
            };
        case 'HISTORY_HIDE_POPUP':
            return {
                ...state,
                toggle: false
            };
        case 'HISTORY_RELOAD':
            return {
                ...state,
                buildList: [...action.buildList],
                hideMore: action.buildList.length <= 0,
                offset: defaultStateHistory.offset+state.stepShow
            };
        default:
            return state;
    }
};
