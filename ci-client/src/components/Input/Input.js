import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import './Input.scss';
import '../Text/Text.scss';


export function Input({ labelText, name, placeholder, maxlength, require, closeBtn, value, type = "text", inputClass }) {
    const inputControl = classNames('input__control', {
        [`input__control_type_${inputClass}`]: inputClass
    });
    const input = classNames('input', {
        [`input__control_type_${inputClass}_input`]: inputClass
    });

    return (
        <div>
            {labelText ? <label for={name} className="input__label text_size_m">{labelText}</label>: "" }
            <div className={inputControl}>
                <input className={input} id={name} name={name} maxlength={maxlength} type={type} placeholder={placeholder} value={value} required={require} />
                {closeBtn ? <Icon type="close" el="input" /> : ""}
            </div>
        </div>
    );
}