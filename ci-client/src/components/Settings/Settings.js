
import React from 'react';
import './Settings.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';
import { Input } from '../Input/Input';

export function Settings() {
    return (
        <>
            <div className='start'>
                <Header title='School CI server' viewTitle="secondary" sizeTitle="xl" />
                <div className="layout">
                    <div className="layout__container">
                        <div className="settings">
                            <h2 className="settings__title text_size_l text_weight_bold">Settings</h2>
                            <div className="settings__description text_size_m text_view_secondary">Configure repository connection and synchronization settings</div>
                            <form class="form">
                                <div class="form__item">
                                    <Input labelText="GitHub repository" name="repository" placeholder="user-name/repo-name" require closeBtn />
                                </div>
                                <div class="form__item">
                                    <Input labelText="Build command" name="command" placeholder="npm ci && npm run build" closeBtn />
                                </div>
                                <div class="form__item">
                                    <Input labelText="Main branch" name="branch" placeholder="master |" closeBtn />
                                </div>
                                <div class="form__item">
                                    <label for="synchronize_minutes" class="form__label text_size_m">Synchronize every</label>
                                    <Input name="synchronize_minutes" value="10" maxlength="3" inputClass="minutes" />
                                    <label for="synchronize_minutes" class="form__label text_size_m">minutes</label>
                                </div>
                                <div class="form__item">
                                    <div class="form__control">
                                        <Button text='Save' type="medium" action additional="form" />
                                        <Button text='Cancel' type="medium" additional="form" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}