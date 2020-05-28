import React from 'react';
import classNames from 'classnames';
import './Icon.scss';

interface IconProps {
    type?: string;
    name?: string;
    el?: string;
    only?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

export function Icon({type, name, el, only, onClick}: IconProps) {

    const iconClass = classNames({
        [`icon_${type}`]: type,
        [`${el}__icon`]: el,
        "button__icon_only": only
    }, "icon");
    return (
        <i onClick={onClick} data-name={name} className={iconClass}></i>
    );
}