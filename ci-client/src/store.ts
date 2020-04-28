import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger'

const middleWares = [thunk];

export const store = createStore( reducer, composeWithDevTools(applyMiddleware(...middleWares, createLogger())));