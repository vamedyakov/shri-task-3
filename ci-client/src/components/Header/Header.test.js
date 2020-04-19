import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store'
import { createBrowserHistory } from 'history';
import { withRouterMock } from '../../reducers/test/testUtils';
import { defaultStateCommon } from '../../reducers/common';
import { defaultStateHistory } from '../../reducers/history';


import {Header} from './Header';

describe('Home component', () => {
    const initialState = {
        common: defaultStateCommon,
        history: defaultStateHistory
    };
    const mockStore = configureStore();
    let store, wrapper, history;

    beforeEach(() => {
        history = createBrowserHistory();
        store = mockStore(initialState);
        wrapper = mount(withRouterMock(<Header menu />, history, store));
    });

    it('Компонент рендерится', () => {
        expect(wrapper.find(Header).length).toEqual(1);
    });

    it('При клике на иконку настроек в шапке, идет переход по урлу /settings', () => {
        const settingsButton = wrapper.find('[data-testid="info-settings-icon"]').hostNodes();
        settingsButton.simulate('click', { button: 0 });

        expect(history.location.pathname).toBe('/settings');
    });

});