import React from 'react';
import { connect } from 'react-redux';
import './History.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import BuildList from '../Build/BuildList';
import PopUp from '../PopUp/PopUp';
import ciServer from '../../api/ciServer';

import {
    HISTORY_PAGE_LOADED,
    HISTORY_SHOW_POPUP,
    HISTORY_HIDE_POPUP
} from '../../constants/actionTypes';


const mapStateToProps = state => ({
    ...state.history,
    userConfig: state.common.userConfig
});

const mapDispatchToProps = dispatch => ({
    onLoad: (buildList) =>
        dispatch({ type: HISTORY_PAGE_LOADED, buildList }),
    onShowPopUp: () =>
        dispatch({ type: HISTORY_SHOW_POPUP }),
    onhidePopUp: () =>
        dispatch({ type: HISTORY_HIDE_POPUP })
});

class History extends React.Component {

    showPopUp() {
        this.props.onShowPopUp();
    }

    hidePopUp() {
        this.props.onhidePopUp();
    }

    handleShowMore() {
        ciServer.getBuilds(this.props.offset, this.props.limit)
            .then(res => {
                if (res.data) {
                    this.props.onLoad(res.data);
                }
            });
    }

    componentDidMount() {
        console.log(this.props);
        if(this.props.buildList && this.props.buildList.length === 0){
            ciServer.getBuilds(this.props.offset, this.props.limit)
                .then(res => {
                    if (res.data) {
                        this.props.onLoad(res.data);
                    }
                });
        }
    }

    render() {
        return (
            <div>
                <Header title={this.props.userConfig.repoName} onClick={this.showPopUp.bind(this)} menu history sizeTitle="xxxl" />
                <div className="layout">
                    <div className="layout__container">
                        <BuildList list={this.props.buildList} hideMore={this.props.hideMore} onClick={this.handleShowMore.bind(this)} />
                    </div>
                </div>
                {this.props.toggle ? <PopUp onClose={this.hidePopUp.bind(this)} /> : null}
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(History);