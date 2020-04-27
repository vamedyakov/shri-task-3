import {
    HISTORY_PAGE_LOADED,
    HISTORY_SHOW_POPUP,
    HISTORY_HIDE_POPUP,
    HISTORY_RELOAD
} from '../constants/actionTypes';

export const defaultStateHistory = {
    offset: 0,
    limit: 5,
    stepShow: 5,
    toggle: false,
    hideMore: false,
    buildsList: []
};

export default (state = defaultStateHistory, action) => {
    switch (action.type) {
        case HISTORY_PAGE_LOADED:
            return {
                ...state,
                buildsList: [...state.buildsList, ...action.buildsList],
                hideMore: action.buildsList.length > 0 ? false : true,
                offset: state.offset+state.stepShow
            };
        case HISTORY_SHOW_POPUP:
            return {
                ...state,
                toggle: true
            };
        case HISTORY_HIDE_POPUP:
            return {
                ...state,
                toggle: false
            };
        case HISTORY_RELOAD:
            return {
                ...state,
                buildsList: [...action.buildsList],
                hideMore: action.buildsList.length > 0 ? false : true,
                offset: defaultStateHistory.offset+state.stepShow
            };
        default:
            return state;
    }
};
