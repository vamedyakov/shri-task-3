import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {store} from './store';
import {createBrowserHistory} from 'history';
import * as serviceWorker from './serviceWorker';

import {AppConnect} from './components/App/App';
import './index.scss';

const history = createBrowserHistory();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>.
            <Router history={history}>
                <AppConnect/>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
serviceWorker.register();
