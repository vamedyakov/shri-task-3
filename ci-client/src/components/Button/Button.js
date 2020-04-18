import React from 'react';
import classNames from 'classnames';
import './Button.scss';
import { Icon } from '../Icon/Icon';
import { Link } from 'react-router-dom';

export class Button extends React.Component {
    render() {
        let { text, to, action, additional, elIcon, only, type, icon, disabled, onClick } = this.props;
        const buttonClass = classNames({
            [`button_${type}`]: type,
            "button_action": action,
            [`${additional}__button`]: additional,
        }, 'button');


        if (to) {
            return (
                <Link to={to} onClick={onClick} className={buttonClass}>
                    {icon ? <Icon type={icon} el={elIcon} only={only} /> : ""}
                    <span className="button__text">{text}</span>
                </Link>
            );
        } else {
            return (
                <button onClick={onClick} className={buttonClass} disabled={disabled}>
                    {icon ? <Icon type={icon} el={elIcon} only={only} /> : ""}
                    <span className="button__text">{text}</span>
                </button>
            );
        }
    }
}
export default Button;
/*export function Button({ text, to, action, additional, elIcon, only, type, icon, disabled, onClick }) {

    const buttonClass = classNames({
        [`button_${type}`]: type,
        "button_action": action,
        [`${additional}__button`]: additional,
    }, 'button');

    if(!onClick && to){
        onClick = () => {
            window.location.assign(to);
        }
    }

    return (
        <button onClick={onClick} className={buttonClass} disabled={disabled}>
            {icon?<Icon type={icon} el={elIcon} only={only}/>:""}
            <span className="button__text">{text}</span>
        </button>
    );
}*/