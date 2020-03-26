import React from 'react';
import './Start.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';

export function Start() {
  return (
      <div className='start'>
        <Header menu title='School CI server' sizeTitle="xxl" />
        <div className="layout">
          <div className="layout__container layout__container_align_center">
            <div className="info-settings">
              <div className="info-settings__logo"></div>
              <div className="info-settings__text text_size_m">Configure repository connection and synchronization settings</div>
              <Button text='Open settings' type="medium" action additional="info-settings" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
}