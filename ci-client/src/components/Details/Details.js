import React from 'react';
import { connect } from 'react-redux';
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

let data = {
    id: "123",
    status: "completed",
    name: "add documentation for postgres scaler",
    branch: "master",
    commit: "9c9f0b9",
    author: "Philip Kirkorov",
    date: "21 янв. 03:06",
    time: "1 ч 20 мин",
    log: ''
}

class Details extends React.Component {

    componentWillMount() {
        Promise.all([
            ciServer.getBuildbyID(this.props.match.params.id),
            ciServer.getBuildLogbyID(this.props.match.params.id)
        ]).then(res => { 
            if(res[0].data){
                this.props.onLoad(res[0].data, res[1].data);
            }
          });
    }

    render() {
        return (
            <div>
                <Header title={this.props.userConfig.repoName} menu details sizeTitle="xxxl" />
                <div className="layout">
                    <div className="layout__container">
                        <div className="detail">
                            <Build additional="detail__content" data={this.props.build} />
                            {this.props.log ?<pre className="log">{this.props.log}</pre>: "" }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Details);