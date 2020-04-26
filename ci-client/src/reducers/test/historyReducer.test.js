import historyReducer, { defaultStateHistory } from '../history';
import {
    HISTORY_PAGE_LOADED,
    HISTORY_SHOW_POPUP,
    HISTORY_HIDE_POPUP,
    HISTORY_RELOAD
} from '../../constants/actionTypes';

describe('Тесты редьюсера commonReducer', () => {
    it('HISTORY_PAGE_LOADED', () => {
        const initianStateTest = { ...defaultStateHistory }
        const action = { type: HISTORY_PAGE_LOADED, buildsList: [] };

        const result = { ...defaultStateHistory, buildsList: [], hideMore: true, offset: defaultStateHistory.offset + defaultStateHistory.stepShow }

        expect(historyReducer(initianStateTest, action)).toEqual({ ...result })
    });

    it('HISTORY_SHOW_POPUP', () => {
        const initianStateTest = { ...defaultStateHistory }
        const action = { type: HISTORY_SHOW_POPUP};

        const result = { ...defaultStateHistory, toggle: true }

        expect(historyReducer(initianStateTest, action)).toEqual({ ...result })
    });

    it('HISTORY_HIDE_POPUP', () => {
        const initianStateTest = { ...defaultStateHistory }
        const action = { type: HISTORY_HIDE_POPUP};

        const result = { ...defaultStateHistory, toggle: false }

        expect(historyReducer(initianStateTest, action)).toEqual({ ...result })
    });

    it('HISTORY_RELOAD', () => {
        const initianStateTest = { ...defaultStateHistory }
        const action = { type: HISTORY_RELOAD, buildsList:[]};

        const result = { ...defaultStateHistory, buildsList: [], hideMore: true, offset: defaultStateHistory.offset + defaultStateHistory.stepShow}

        expect(historyReducer(initianStateTest, action)).toEqual({ ...result })
    });
});