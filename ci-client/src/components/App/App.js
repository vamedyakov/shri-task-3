import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../../constants/actionTypes';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import { store } from '../../store';


import { Start } from '../Start/Start';
import { Settings } from '../Settings/Settings';
import { History } from '../History/History';
import { Details } from '../Details/Details';
import { Header } from '../Header/Header';
import './App.scss';

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    /*if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }*/
  }

  componentWillMount() {
    this.props.onLoad(null, '132');
    /*if(false){

    }else {
      store.dispatch(push('/settings'));
      this.props.onRedirect();

    }*/
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div className="app">
          <Router>
            <Switch>
              <Route exact path="/" component={Start} />
              <Route path="/settings" component={Settings} />
              <Route path='/history' component={History} />
              <Route path='/build/:id' component={Details} />
            </Switch>
          </Router>
        </div>
      );
    }
    return (
      <div className="app">
        <Header menu title='School CI server' sizeTitle="xxl" />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
