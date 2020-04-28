import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {Switch, Route} from 'react-router-dom';
import WebApiClient from '../../api/WebApiClient';
import {actionTypes} from '../../constants/actionTypes';
import {initialStateCommon} from "../../reducers/common";
import {ConfigurationModel} from '../../typings/api/models';

import {Header} from '../Header/Header';
import {Footer} from '../Footer/Footer';
import Home from '../Home/Home';
import Settings from '../Settings/Settings';
import {HistoryConnect} from '../History/History';
import Details from '../Details/Details';

import './App.scss';

interface stateProps {
    common: initialStateCommon;
}

const mapStateToProps = ({common}: stateProps) => {
    return {
        ...common
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onLoad: (userConf: ConfigurationModel) =>
        dispatch({type: actionTypes.APP_LOAD, userConf,})
});

interface Props extends initialStateCommon {
    onLoad(userConf: ConfigurationModel): void;
}

class App extends React.Component<Props> {

    componentDidMount() {
        WebApiClient.getSettings()
            .then(res => this.props.onLoad(res))
            .catch(e => console.log("Критическая ошибка: " + e.toString()));
    }

    render() {
        if (this.props.appLoaded) {
            return (
                <div className="app">
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/settings" component={Settings}/>
                        <Route path='/history' component={HistoryConnect}/>
                        <Route path='/build/:id' component={Details}/>
                    </Switch>
                    <Footer/>
                </div>
            );
        }
        return (
            <div className="app">
                <Header menu title='School CI server' sizeTitle="xxl"/>
                <Footer/>
            </div>
        );
    }
}

export const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App);
