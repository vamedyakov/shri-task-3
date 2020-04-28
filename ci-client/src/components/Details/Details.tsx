import React from 'react';
import {connect} from 'react-redux';
import {withRouter, match} from 'react-router-dom';
import {Dispatch} from 'redux';
import {History} from "history";
import Convert from 'ansi-to-html';
import WebApiClient from '../../api/WebApiClient';
import {actionTypes} from '../../constants/actionTypes';
import {initialStateDetails} from "../../reducers/details";
import {initialStateCommon} from "../../reducers/common";
import {BuildModel} from "../../typings/api/buildModel";

import {Header} from '../Header/Header';
import {Build} from '../Build/Build';

import './Details.scss';

interface stateProps {
    details: initialStateDetails;
    common: initialStateCommon;
}

const mapStateToProps = ({details, common}: stateProps) => ({
    ...details,
    ...common,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onLoad: (build: BuildModel, log: string) =>
        dispatch({type: actionTypes.DETAILS_PAGE_LOADED, build, log}),
    unLoad: () =>
        dispatch({type: actionTypes.DETAILS_PAGE_UNLOAD})
});

interface optionRoute {
    id: string;
}

interface Props extends initialStateDetails, initialStateCommon {
    onLoad(build: BuildModel, log: string): void;

    unLoad(): void;

    history?: History;
    match: match<optionRoute>;
}

class Details extends React.Component<Props> {

    getBuild(buildId: string) {
        Promise.all([
            WebApiClient.getBuildByID(buildId),
            WebApiClient.getBuildLogByID(buildId)
        ]).then(res => this.props.onLoad(res[0], res[1]))
            .catch(e => console.log("Критическая ошибка: " + e.toString()));
    }

    handleRebuild() {
        if (this.props.build) {
            WebApiClient.postAddBuildQueue(this.props.build.commitHash)
                .then(res => {
                    if (this.props.history) {
                        this.props.history.push(`/build/${res.id}/`);
                        this.props.unLoad();
                        this.getBuild(this.props.match.params.id);
                    }
                })
                .catch(e => console.log("Критическая ошибка: " + e.toString()));
        }
    }

    componentWillUnmount() {
        this.props.unLoad();
    }

    componentWillMount() {
        this.getBuild(this.props.match.params.id);
    }

    render() {
        const convert = new Convert({fg: '#000', bg: '#000'});
        return (
            <div>
                <Header title={this.props.userConfig.repoName} onClick={() => this.handleRebuild()} menu details
                        sizeTitle="xxxl"/>
                <div className="layout">
                    <div className="layout__container">
                        <div className="detail">
                            <Build additional="detail__content" data={this.props.build}/>
                            {this.props.log
                                ? <pre className="log"
                                       dangerouslySetInnerHTML={{__html: convert.toHtml(this.props.log)}}/>
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Details));