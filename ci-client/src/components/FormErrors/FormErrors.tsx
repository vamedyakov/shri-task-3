import React from 'react';
import './FormErrors.scss';

interface FormErrorsProps {
    formErrors: Array<string>;
}

export const FormErrors = ({formErrors}: FormErrorsProps) => {
    if (formErrors.length > 0) {
        return (
            <div className='form__errors'>
                {formErrors.map((fieldName, i) => {
                    return (
                        <div key={i}>{fieldName}</div>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div/>
        )
    }
}
