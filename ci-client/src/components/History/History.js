import React from 'react';
import './History.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Build } from '../Build/Build';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';


let data = {
    id: "123",
    status: "completed",
    name: "add documentation for postgres scaler",
    branch: "master",
    commit: "9c9f0b9",
    author: "Philip Kirkorov",
    date: "21 янв. 03:06",
    time: "1 ч 20 мин"
}

export function History() {
    return (
            <div className='start'>
                <Header title='philip1967/my-awesome-repo-with-long-long-repo-name' menu history sizeTitle="xxxl" />
                <div className="layout">
                    <div className="layout__container">
                        <div className="list">
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <Build additional="list__content" data={data} />
                            <div class="list__navigation">
                                <Button text="Show more" type="medium" additional="list-navigation" />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
    );
}