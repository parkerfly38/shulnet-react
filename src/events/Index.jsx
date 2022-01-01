import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { EventsCalendar } from './EventsCalendar';

function Events({ match }) {
    const { path } = match;

    return (
        <div className="p-4">
            <div className="container-fluid">
                <Switch>
                    <Route exact path={path} component={EventsCalendar} />
                    <Route path={`${path}/:id`} component={EventsCalendar} />
                </Switch>
            </div>
        </div>
    );
}

export { Events };