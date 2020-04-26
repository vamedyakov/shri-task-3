import React from 'react';
import { connect } from 'react-redux';
import './Home.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';


import {
  HOME_PAGE_LOADED,
} from '../../constants/actionTypes';


const mapStateToProps = state => ({
  userConfig: state.common.userConfig
});

const mapDispatchToProps = dispatch => ({
  onLoad: () =>
    dispatch({ type: HOME_PAGE_LOADED,}),
});

class Home extends React.Component {

  componentDidMount() {
    if (this.props.userConfig.repoName){
      this.props.history.push("/history");
    }else{
      this.props.onLoad();
    }
  }

  render() {
      return (
        <div>
          <Header menu title='School CI server' viewTitle="secondary" sizeTitle="xxl" />
          <div className="layout">
            <div className="layout__container layout__container_align_center">
              <div className="info-settings">
                <div className="info-settings__logo"></div>
                <div className="info-settings__text text_size_m">Configure repository connection and synchronization settings</div>
                <Button text='Open settings' to="/settings" type="medium" action additional="info-settings" />
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);