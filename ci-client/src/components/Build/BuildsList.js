import { Build } from './Build';
import { Button } from '../Button/Button';
import { Link } from 'react-router-dom';
import React from 'react';

const BuildsList = props => {
    if (props.buildsList) {
        return (
            <div className="list">
                {
                    props.buildsList.map(build => {
                        const buildLink = `/build/${build.id}/`
                        return (
                            <Link key={build.id} to={buildLink} className="build__link">
                                <Build additional="list__content" data={build} />
                            </Link>
                        );
                    })
                }
                {!props.hideMore ?
                    <div className="list__navigation">
                        <Button text="Show more" onClick={props.onClick} type="medium" additional="list-navigation" />
                    </div>
                    : null
                }
            </div>
        );
    }

    return (
        <div className="list">
            <div className="list__navigation">
                <Button text="Show more" type="medium" additional="list-navigation" />
            </div>
        </div>
    );
};

export default BuildsList;
