import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService, portalService } from '@/_services';
import { Nav, PrivateRoute, Alert } from '@/_components';
import { Home } from '@/home';
import { Profile } from '@/profile';
import { Admin } from '@/admin';
import { Account } from '@/account';
import { FamilyMembers } from '@/familymembers';
import { Yahrzeits } from '@/yahrzeits';
import { Events } from '@/events';
import { PortalSignup } from '@/portal-signup';

function App() {
    const { pathname } = useLocation();  
    const [user, setUser] = useState({});

    useEffect(() => {
        //also get our portal def
        portalService.getByDomain(window.location.hostname)
            .then(data => {
                if(!data)
                {

                } else {
                    localStorage.setItem("portalId", data.id);
                    localStorage.setItem("portalName", data.institution_name);
                }
            });
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    return (
        <div className={'app-container' + (user && ' bg-light')}>
            <Nav />
            <Alert />
            <Switch>
                <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                <PrivateRoute path="/familymembers" component={FamilyMembers} />
                <PrivateRoute path="/yahrzeits" component={Yahrzeits} />
                <PrivateRoute path="/events" component={Events} />
                <Route path="/portal-signup" component={PortalSignup} />
                <Route path="/account" component={Account} />
                <Redirect from="*" to="/" />
            </Switch>
        </div>
    );
}

export { App }; 