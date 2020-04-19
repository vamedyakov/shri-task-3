import settingsReducer, { defaultStateSettings } from '../settings';
import {
    SETTINGS_SAVED,
    SETTINGS_SUBMIT_FORM
} from '../../constants/actionTypes';

describe('Тесты редьюсера commonReducer', () => {
    it('SETTINGS_SAVED', () => {
        const initianStateTest = { ...defaultStateSettings }
        const action = { type: SETTINGS_SAVED};

        const result = { ...defaultStateSettings, inProgress: false }

        expect(settingsReducer(initianStateTest, action)).toEqual({ ...result })
    });

    it('SETTINGS_SUBMIT_FORM', () => {
        const initianStateTest = { ...defaultStateSettings }
        const action = { type: SETTINGS_SUBMIT_FORM};

        const result = { ...defaultStateSettings, inProgress: true }

        expect(settingsReducer(initianStateTest, action)).toEqual({ ...result })
    });
});