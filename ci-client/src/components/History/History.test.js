import React from 'react';
import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import { withRouterMock } from '../../reducers/test/testUtils';

import History from './History';
import PopUp from '../PopUp/PopUp';
import { store } from '../../store';

describe('Home component', () => {
    let  wrapper, history;

    beforeEach(() => {
        history = createBrowserHistory();
        wrapper = mount(withRouterMock(<History />, history, store));
    });

    it('Компонент рендерится', () => {
        expect(wrapper.find(History).length).toEqual(1);
    });

    it('При клике на Run Build, открывается модальное окно', () => {
        const settingsButton = wrapper.find('[data-testid="run-build-icon"]').hostNodes();
        settingsButton.simulate('click');

        expect(wrapper.find(PopUp).length).toBe(1);
    });

});