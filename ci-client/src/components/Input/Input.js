import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import './Input.scss';
import '../Text/Text.scss';


export function Input({ labelText, onChange, name, placeholder, maxlength, require, closeBtn, closeBtnOnClick, value, type = "text", inputClass }) {
    const inputControl = classNames('input__control', {
        [`input__control_type_${inputClass}`]: inputClass
    });
    const input = classNames('input', {
        [`input__control_type_${inputClass}_input`]: inputClass
    });

    return (
        <div className="input__group">
            {labelText ? <label htmlFor={name} className="input__label text_size_m">{labelText}</label> : ""}
            <div className={inputControl}>
                <input
                    className={input}
                    id={name}
                    onChange={onChange}
                    name={name}
                    maxLength={maxlength}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    required={require}
                />
                {closeBtn ? <Icon type="close" name={name} on el="input" onClick={closeBtnOnClick} /> : ""}
            </div>
        </div>
    );
}