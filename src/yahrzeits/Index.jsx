import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ListYahrzeits } from './ListYahrzeits';
import { AddEdit } from './AddEdit';

function Yahrzeits({ match }) {
    const { path } = match;

    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={ListYahrzeits} />
                    <Route path={`${path}/add`} component={AddEdit} />
                    <Route path={`${path}/edit/:id`} component={AddEdit} />
                </Switch>
            </div>
        </div>
    );
}

export { Yahrzeits };