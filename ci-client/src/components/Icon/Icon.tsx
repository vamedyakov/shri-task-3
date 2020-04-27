import React from 'react';
import classNames from 'classnames';
import './Icon.scss';

export function Icon({ type, name, el, only, onClick }) {

    const iconClass = classNames({
        [`icon_${type}`]: type,
        [`${el}__icon`]: el,
        "button__icon_only": only
    }, "icon");
    return (
        <i onClick={onClick} data-name={name} className={iconClass}></i>
    );
}