import React from 'react';
import { connect } from 'react-redux';
import './History.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import BuildsList from '../Build/BuildsList';
import ciServer from '../../api/ciServer';

import {
    HISTORY_PAGE_LOADED
} from '../../constants/actionTypes';


const mapStateToProps = state => ({
    userConfig: state.common.userConfig,
    buildsList: state.common.buildsList
});

const mapDispatchToProps = dispatch => ({
    onLoad: (buildsList) =>
        dispatch({ type: HISTORY_PAGE_LOADED, buildsList })
});

class History extends React.Component {

    componentWillMount() {
        ciServer.getAllbuilds()
          .then(res => {
              if(res.data){
                this.props.onLoad(res.data);
              }
          });
    }

    render() {
        return (
            <div>
                <Header title={this.props.userConfig.repoName} menu history sizeTitle="xxxl" />
                <div className="layout">
                    <div className="layout__container">
                        <BuildsList buildsList={this.props.buildsList} />
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(History);