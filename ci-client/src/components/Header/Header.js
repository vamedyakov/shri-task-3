import React from 'react';
import classNames from 'classnames';
import './Header.scss';
import '../Text/Text.scss';
import { Button } from '../Button/Button';

export function Header({ menu, details, history, onClick, title, sizeTitle, viewTitle }) {
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
                        {details ? <Button text="Rebuild" onClick={onClick} type="small" elIcon="button" icon="rebuild"  additional="rebuild-icon" /> : ""}
                        {history ? <Button text="Run build" onClick={onClick} type="small" elIcon="button" icon="run-build" additional="run-build-icon" /> : ""}
                        {(details || history) ? <Button type="small" to="/settings" elIcon="button" icon="settings" additional="info-settings-icon" only /> : <Button text="Settings" to="/settings" type="small" elIcon="button" icon="settings"  additional="info-settings-icon" />}
                    </div>
                    : ""}
            </div>
        </header>

    );
}