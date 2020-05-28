import React from 'react';
import classNames from 'classnames';
import './Button.scss';
import { Icon } from '../Icon/Icon';
import { Link } from 'react-router-dom';

interface ButtonProps {
    text?: string;
    to?: string;
    action?: boolean;
    additional?: string;
    elIcon?: string;
    only?: boolean;
    type?: string;
    icon?: string;
    disabled?: boolean;
    onClick ?: () => void;
}

export class Button extends React.Component<ButtonProps> {
    render() {
        let { text, to, action, additional, elIcon, only, type, icon, disabled, onClick } = this.props;
        const buttonClass = classNames({
            [`button_${type}`]: type,
            "button_action": action,
            [`${additional}__button`]: additional,
        }, 'button');


        if (to) {
            return (
                <Link data-testid={additional} to={to} onClick={onClick} className={buttonClass}>
                    {icon ? <Icon type={icon} el={elIcon} only={only} /> : ""}
                    <span className="button__text">{text}</span>
                </Link>
            );
        } else {
            return (
                <button data-testid={additional} onClick={onClick} className={buttonClass} disabled={disabled}>
                    {icon ? <Icon type={icon} el={elIcon} only={only} /> : ""}
                    <span className="button__text">{text}</span>
                </button>
            );
        }
    }
}
export default Button;