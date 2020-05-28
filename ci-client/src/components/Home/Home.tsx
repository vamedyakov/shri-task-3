import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Dispatch} from 'redux';
import {History} from "history";
import {actionTypes} from '../../constants/actionTypes';
import {initialStateCommon} from '../../reducers/common';

import {Header} from '../Header/Header';
import {Button} from '../Button/Button';

import './Home.scss';

interface stateProps {
    common: initialStateCommon;
}

const mapStateToProps = ({common}: stateProps) => ({
    ...common
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onLoad: () =>
        dispatch({type: actionTypes.HOME_PAGE_LOADED,}),
});

interface Props extends initialStateCommon {
    onLoad(): void;

    history?: History;
}

class Home extends React.Component<Props> {

    componentDidMount() {
        if (this.props.userConfig.repoName) {
            if (this.props.history) {
                this.props.history.push("/history");
            }
        } else {
            this.props.onLoad();
        }
    }

    render() {
        return (
            <div>
                <Header menu title='School CI server' viewTitle="secondary" sizeTitle="xxl"/>
                <div className="layout">
                    <div className="layout__container layout__container_align_center">
                        <div className="info-settings">
                            <div className="info-settings__logo"/>
                            <div className="info-settings__text text_size_m">Configure repository connection and
                                synchronization settings
                            </div>
                            <Button text='Open settings' to="/settings" type="medium" action
                                    additional="info-settings"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));