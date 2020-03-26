import React from 'react';
import classNames from 'classnames';
import './Icon.scss';

export function Icon({ type, el, only }) {

    const iconClass = classNames({
        [`icon_${type}`]: type,
        [`${el}__icon`]: el,
        "button__icon_only": only
    }, "icon");
    return (
        <i className={iconClass}></i>
    );
}