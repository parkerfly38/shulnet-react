import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PortalList } from './PortalList';
//import { AddEdit } from './AddEdit';

function Portals({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={PortalList} />
            {
            //<Route path={`${path}/add`} component={AddEdit} />
            //<Route path={`${path}/edit/:id`} component={AddEdit} />
            }
        </Switch>
    );
}

export { Portals };