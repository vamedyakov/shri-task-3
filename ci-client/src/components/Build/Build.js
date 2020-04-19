import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'
import './Build.scss';
import '../Text/Text.scss';

let BuildStatus = {
    Waiting: "processing",
    InProgress: "processing",
    Success: "completed",
    Fail: "fail",
    Canceled: "fail",
}

export function Build({ additional, data }) {
    if (data) {
        let status = BuildStatus[data.status];
        const build = classNames({
            [`${additional}`]: additional,
        }, "build");

        const statusClass = classNames({
            [`build__status_${additional}`]: status,
        }, "build__number");

        return (
            <div className={build}>
                <div className="build__left">
                    <div className="build__head">
                        <div className={statusClass}><Icon type={status} el="build-status" />#{data.buildNumber}</div>
                        <div className="build__title text_size_l">{data.commitMessage}</div>
                    </div>
                    <div className="build__middle">
                        <div className="build__branch build_align_center"><Icon type="branch" el="build" /> {data.branchName} <span className="build__commit">{data.commitHash}</span></div>
                        <div className="build__author build_align_center"><Icon type="author" el="build" /> {data.authorName}</div>
                    </div>
                </div>
                <div>
                    {(data.start || data.duration) ?
                        <div className="build__footer">
                            {data.start ? <div className="build__date build_align_center"><Icon type="calendar" el="build" />{format(new Date(data.start), 'd MMM HH:mm', { locale: ru }).replace('.', ',')}</div> : ""}
                            {data.duration ? <div className="build__duration build_align_center"><Icon type="time" el="build" />{`${data.duration / 60 ^ 0} ч ${data.duration % 60} мин`}</div> : ""}
                        </div>
                        : ""
                    }
                </div>
            </div>
        );
    } else {
        return (<div></div>);
    }
}