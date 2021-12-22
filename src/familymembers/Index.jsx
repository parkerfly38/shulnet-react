import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ListFamilyMembers } from './ListFamilyMembers';
import { AddEdit } from './AddEdit';

function FamilyMembers({ match }) {
    const { path } = match;

    return (        
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={ListFamilyMembers} />
                    <Route path={`${path}/add`} component={AddEdit} />
                    <Route path={`${path}/edit/:id`} component={AddEdit} />
                </Switch>
            </div>
        </div>
    );
}

export { FamilyMembers };