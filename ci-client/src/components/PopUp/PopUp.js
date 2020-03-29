import React from 'react';
import './PopUp.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

export function PopUp() {
  return (
    <div className='popup'>
      <div className='popup__wrapper'>
        <form className='popup__form'>
          <h3 className='popup__title'>New build</h3>
          <p className='popup__description'>Enter the commit hash which you want to build.</p>
          
          <Input name="commitHash" placeholder="Commit hash" closeBtn />
          <div className='popup__button-wrapper'>
            <Button text='Run build' type="medium" action additional="form" />
            <Button text='Cancel' type="medium" additional="form" />
          </div>
        </form>
      </div>
    </div>
  );
}