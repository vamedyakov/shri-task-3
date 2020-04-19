import commonReducer, { defaultStateCommon } from '../common';
import {
    APP_LOAD,
    DETAILS_PAGE_LOADED
} from '../../constants/actionTypes';

describe('Тесты редьюсера commonReducer', () => {
    it('APP_LOAD', () => {
        const initianStateTest = { ...defaultStateCommon }
        const action = { type: APP_LOAD, userConfig: { repoName: 'test' } };

        const result = { ...defaultStateCommon, appLoaded: true }
        result.userConfig.repoName = 'test';

        expect(commonReducer(initianStateTest, action)).toEqual({ ...result })
    });

    it('DETAILS_PAGE_LOADED', () => {
        const initianStateTest = { ...defaultStateCommon }
        const action = { type: DETAILS_PAGE_LOADED, build: 'test', log: 'test' };

        const result = { ...defaultStateCommon, build: 'test', log: 'test'}

        expect(commonReducer(initianStateTest, action)).toEqual({ ...result })
    });
});