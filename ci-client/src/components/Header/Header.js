import React from 'react';
import classNames from 'classnames';
import './Header.scss';
import '../Text/Text.scss';
import { Button } from '../Button/Button';

export function Header({ menu, details, history, title, sizeTitle, viewTitle }) {
    const headerTitleClass = classNames('header__h1', {
        [`text_size_${sizeTitle}`]: sizeTitle,
        [`text_view_${viewTitle}`]: viewTitle,
    });

    return (
        <header className="header">
            <div className="header__content">
                <h1 className={headerTitleClass}>{title}</h1>
                {menu ?
                    <div className='header__menu'>
                        {details ? <Button text="Rebuild" type="small" elIcon="button" icon="rebuild" /> : ""}
                        {history ? <Button text="Run build" type="small" elIcon="button" icon="run-build" /> : ""}
                        {(details || history) ? <Button type="small" to="/settings" elIcon="button" icon="settings" only /> : <Button text="Settings" to="/settings" type="small" elIcon="button" icon="settings" />}
                    </div>
                    : ""}
            </div>
        </header>

    );
}