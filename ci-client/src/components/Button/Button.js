import React from 'react';
import classNames from 'classnames';
import './Button.scss';
import { Icon } from '../Icon/Icon';

export function Button({ text, action, additional, elIcon, only, type, icon, disabled, onClick }) {

    const buttonClass = classNames({
        [`button_${type}`]: type,
        "button_action": action,
        [`${additional}__button`]: additional,
    }, 'button');
    return (
        <button onClick={onClick} className={buttonClass} disabled={disabled}>
            {icon?<Icon type={icon} el={elIcon} only={only}/>:""}
            <span className="button__text">{text}</span>
        </button>
    );
}