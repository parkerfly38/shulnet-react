import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

function Nav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav">
                    <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                    <NavLink to="/profile" className="nav-item nav-link">Profile</NavLink>
                    <NavLink to="/familymembers" className="nav-item nav-link">Family Members</NavLink>
                    <NavLink to="/yahrzeits" className="nav-item nav-link">Yahrzeits</NavLink>
                    <NavLink to="/events" className="nav-item nav-link">Events</NavLink>
                    {user.role === Role.Admin &&
                        <NavLink to="/admin" className="nav-item nav-link">Admin</NavLink>
                    }
                    <a onClick={accountService.logout} className="nav-item nav-link">Logout</a>
                </div>
            </nav>
            <Route path="/admin" component={AdminNav} />
        </div>
    );
}

function AdminNav({ match }) {
    const { path } = match;    
    const host = window.location.hostname;
    const portalId = localStorage.getItem("portalId");

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light">
            <div className="navbar-nav">
                <NavLink to={`${path}/users`} className="nav-item nav-link">Users</NavLink>
                {(host.indexOf("www") > -1 || host === "localhost") &&
                        <NavLink to="/admin/portals" className="nav-item nav-link">Portals</NavLink>
                }
                {(host.indexOf("www") == -1 && host != "localhost") &&
                        <NavLink to={`/admin/portals/edit/${portalId}`} className="navItem nav-link">Your Portal Details</NavLink>
                }
            </div>
        </nav>
    );
}

export { Nav }; 