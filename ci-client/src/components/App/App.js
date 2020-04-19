import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Switch, Route, Router } from 'react-router-dom';

import { APP_LOAD } from '../../constants/actionTypes';

import ciServer from '../../api/ciServer';
import { createBrowserHistory } from 'history';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import Home from '../Home/Home';
import Settings from '../Settings/Settings';
import History from '../History/History';
import Details from '../Details/Details';
import './App.scss';

const history = createBrowserHistory();

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    userConfig: state.common.userConfig
  }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (userConf) =>
    dispatch({ type: APP_LOAD, userConf, })
});

class App extends React.Component {
  componentDidMount() {
    ciServer.getSettings()
      .then(res => {
        this.props.onLoad(res.data);
      });
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div className="app">
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/settings" component={Settings} />
              <Route path='/history' component={History} />
              <Route path='/build/:id' component={Details} />
            </Switch>
          </Router>
          <Footer />
        </div>
      );
    }
    return (
      <div className="app">
        <Header menu title='School CI server' sizeTitle="xxl" />
        <Footer />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
