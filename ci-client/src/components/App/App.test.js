import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store'
import { createMemoryHistory } from 'history';
import { withRouterMock } from '../../reducers/test/testUtils';

import App from './App';
import Home from '../Home/Home';
import History from '../History/History';


describe('App component', () => {
    const initialState = {
        common: {
            userConfig: {
                repoName: '',
            },
            appLoaded: true
        }
    };
    const mockStore = configureStore();
    let store, wrapper, history;

    beforeEach(() => {
        history = createMemoryHistory();
    });

    it('Показ главной страницы при отсутствии настроек', () => {
        store = mockStore(initialState);
        wrapper = mount(withRouterMock(<App />, history, store));

        expect(wrapper.find(Home).length).toEqual(1);
    });

    it('Показ списка билдов если есть натройки', () => {
        initialState.common.userConfig.repoName = 'vamedyakov/shri-task-3';

        store = mockStore(initialState);
        wrapper = mount(withRouterMock(<App />, history, store));

        expect(wrapper.find(History).length).toEqual(1);
    });
});