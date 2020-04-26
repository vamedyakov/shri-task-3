import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

export const withRouterMock = (Component, historyMock, storeMock) => {
    historyMock = Object.assign({ push: jest.fn(), location: {}, listen: jest.fn()}, historyMock);

    return <Provider store={storeMock}><Router history={historyMock}>{Component}</Router></Provider>
}