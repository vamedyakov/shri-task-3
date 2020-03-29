import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import { createLogger } from 'redux-logger'

const middleWares = [thunk];

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(...middleWares, promiseMiddleware, localStorageMiddleware);
  } else {
    // Enable additional logging in non-production environments.
    return applyMiddleware(...middleWares, promiseMiddleware, localStorageMiddleware, createLogger())
  }
};
export const store = createStore( reducer, composeWithDevTools(getMiddleware()));