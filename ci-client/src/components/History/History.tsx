import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Dispatch} from 'redux';
import WebApiClient from '../../api/WebApiClient';
import {BuildModel} from '../../typings/api/models';
import {actionTypes} from '../../constants/actionTypes';
import {initialStateCommon} from '../../reducers/common';
import {initialStateHistory} from '../../reducers/history';

import {Header} from '../Header/Header';
import BuildList from '../Build/BuildList';
import PopUp from '../PopUp/PopUp';

import './History.scss';

interface stateProps {
    historyPage: initialStateHistory;
    common: initialStateCommon;
}

const mapStateToProps = ({historyPage, common}: stateProps) => ({
    ...historyPage,
    ...common
});

interface Props extends initialStateHistory, initialStateCommon {
    onLoad(buildList: Array<BuildModel>): void;

    onShowPopUp(): void;

    onHidePopUp(): void;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onLoad: (buildList: Array<BuildModel>) =>
        dispatch({type: actionTypes.HISTORY_PAGE_LOADED, buildList}),
    onShowPopUp: () =>
        dispatch({type: actionTypes.HISTORY_SHOW_POPUP}),
    onHidePopUp: () =>
        dispatch({type: actionTypes.HISTORY_HIDE_POPUP})
});

class CHistory extends React.Component<Props> {

    handleShowMore() {
        WebApiClient.getBuilds(this.props.offset, this.props.limit)
            .then(res => this.props.onLoad(res))
            .catch(e => console.log("Критическая ошибка: " + e.toString()));
    }

    componentDidMount() {
        if (this.props.buildList && this.props.buildList.length === 0) {
            WebApiClient.getBuilds(this.props.offset, this.props.limit)
                .then(res => this.props.onLoad(res))
                .catch(e => console.log("Критическая ошибка: " + e.toString()));
        }
    }

    render() {
        return (
            <div>
                <Header title={this.props.userConfig.repoName}
                        onClick={this.props.onShowPopUp} menu history
                        sizeTitle="xxxl"/>
                <div className="layout">
                    <div className="layout__container">
                        <BuildList list={this.props.buildList}
                                   hideMore={this.props.hideMore}
                                   onClick={() => this.handleShowMore()}/>
                    </div>
                </div>
                {this.props.toggle ? <PopUp onClose={this.props.onHidePopUp}/> : null}
            </div>
        );
    }
}

export const HistoryConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(CHistory));