import React from 'react';
import { connect } from 'react-redux';
import Convert from 'ansi-to-html';
import './Details.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Build } from '../Build/Build';
import ciServer from '../../api/ciServer';

import {
    DETAILS_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    userConfig: state.common.userConfig,
    build: state.common.build,
    log: state.common.log
});

const mapDispatchToProps = dispatch => ({
    onLoad: (build, log) =>
        dispatch({ type: DETAILS_PAGE_LOADED, build, log })
});

class Details extends React.Component {

    handleRebuild() {
        ciServer.postAddQueue(this.props.build).then(res => {
            if (res.status === 200) {
                this.props.history.push(`/build/${res.data.id}/`);
            }
        });
    }

    componentWillMount() {
        Promise.all([
            ciServer.getBuildbyID(this.props.match.params.id),
            ciServer.getBuildLogbyID(this.props.match.params.id)
        ]).then(res => {
            if (res[0].data) {
                this.props.onLoad(res[0].data, res[1].data);
            }
        });
    }

    render() {
        const convert = new Convert({ fg: '#000', bg: '#000' });
        return (
            <div>
                <Header title={this.props.userConfig.repoName} onClick={this.handleRebuild.bind(this)} menu details sizeTitle="xxxl" />
                <div className="layout">
                    <div className="layout__container">
                        <div className="detail">
                            <Build additional="detail__content" data={this.props.build} />
                            {this.props.log ? <pre className="log" dangerouslySetInnerHTML={{__html:convert.toHtml(this.props.log)}}></pre> : ""}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Details);