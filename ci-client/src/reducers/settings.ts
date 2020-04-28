import {actionTypes} from '../constants/actionTypes';

export interface initialStateSettings {
    inProgress: boolean;
}

export const defaultStateSettings: initialStateSettings = {
    inProgress: false
};

interface settingsActions {
    type: actionTypes,
    inProgress: boolean,
}


export default (state = defaultStateSettings, action: settingsActions) => {
    switch (action.type) {
        case 'SETTINGS_SAVED':
            return {
                ...state,
                inProgress: false,
            };
        case 'SETTINGS_SUBMIT_FORM':
            return {
                ...state,
                inProgress: true,
            };
        default:
            return state;
    }
};
