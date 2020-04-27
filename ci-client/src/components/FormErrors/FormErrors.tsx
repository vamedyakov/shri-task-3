import React from 'react';
import './FormErrors.scss';

export const FormErrors = ({ formErrors }) => {
    if(formErrors.length > 0) {
        console.log(formErrors);
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
            <div></div>
        )
    }
}
