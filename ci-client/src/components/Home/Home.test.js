import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store'
import { createBrowserHistory } from 'history';
import { withRouterMock } from '../../reducers/test/testUtils';
import { defaultStateCommon } from '../../reducers/common';


import Home from './Home';

describe('Home component', () => {
    const initialState = {
        common: defaultStateCommon
    };
    const mockStore = configureStore();
    let store, wrapper, history;

    beforeEach(() => {
        history = createBrowserHistory();
        store = mockStore(initialState);
        wrapper = mount(withRouterMock(<Home />, history, store));
    });

    it('Компонент рендерится', () => {
        expect(wrapper.find(Home).length).toEqual(1);
    });

    it('При клике на кнопку Open settings, идет переход по урлу /settings', () => {
        const settingsButton = wrapper.find('[data-testid="info-settings"]').hostNodes();
        settingsButton.simulate('click', { button: 0 });

        expect(history.location.pathname).toBe('/settings');
    });
});