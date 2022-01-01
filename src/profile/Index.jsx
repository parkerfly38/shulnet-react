import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Details } from './Details';
import { Update } from './Update';
import { UpdateDetails } from './UpdateDetails';

function Profile({ match }) {
    const { path } = match;
    
    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Details} />
                    <Route path={`${path}/update`} component={Update} />
                    <Route path={`${path}/updatedetails/:id`} component={UpdateDetails} />
                </Switch>
            </div>
        </div>
    );
}

export { Profile };