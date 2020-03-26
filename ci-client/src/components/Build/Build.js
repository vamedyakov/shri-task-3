import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import './Build.scss';
import '../Text/Text.scss';

export function Build({ additional, data }) {
    const build = classNames({
        [`${additional}`]: additional,
    }, "build");
    
    const status = classNames({
        [`build__status_${additional}`]: data.status,
    }, "build__number");

    return (
        <div className={build}>
            <div className="build__left">
                <div className="build__head">
                    <div className={status}><Icon type={data.status} el="build-status" />#{data.id}</div>
                    <div className="build__title text_size_l">{data.name}</div>
                </div>
                <div className="build__middle">
                    <div className="build__branch build_align_center"><Icon type="branch" el="build" /> {data.branch} <span className="build__commit">{data.commit}</span></div>
                    <div className="build__author build_align_center"><Icon type="author" el="build" /> {data.author}</div>
                </div>
            </div>
            <div>
                <div className="build__footer">
                    <div className="build__date build_align_center"><Icon type="calendar" el="build" /> {data.date}</div>
                    <div className="build__duration build_align_center"><Icon type="time" el="build" /> {data.time}</div>
                </div>
            </div>
        </div>
    );
}