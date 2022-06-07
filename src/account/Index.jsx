import React, { useEffect, useState } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import { accountService, portalService } from '@/_services';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

import './styles.module.less';

function Account({ history, match }) {
    const [portal, setPortal] = useState();
    const { path } = match;
 
    useEffect(() => {
        const arrBodyBg = ['bodybg1','bodybg2'];
        const arrPhotoCredit = [
            'Photo of <a href="https://www.cbisrael.org">Congregation Beth Israel in Bangor, Maine</a> by Brian Kresge',
            'Photo by <a href="https://unsplash.com/@bokcily?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Boris Ivanović</a> on <a href="https://unsplash.com/s/photos/synagogue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
        ];
        const imgIndex = (Math.floor(Math.random() * (arrBodyBg.length - 1 + 1) + 1))-1;
        const bodybg = arrBodyBg[imgIndex];
        document.body.classList.add(bodybg);
        document.getElementById('photoCredit').innerHTML = arrPhotoCredit[imgIndex];
        //setPortal(portalService.getByDomain(window.location.hostname));
        //console.log(portal);
        // redirect to home if already logged in
        if (accountService.userValue) {
            history.push('/');
        }
        return () => {
            document.body.classList.remove("bodybg1");
            document.body.classList.remove("bodybg2");
        }
    }, []);

    const cardStyle = {
        top: '50%'
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6 mt-5">
                    <div className="card m-3" style={cardStyle}>
                        <h3 className="card-header">Welcome to ShulNET</h3>
                        <div className="card-body">
                            <p>ShulNET is an open source, community-developed, whole synagogue management platform.</p>
                            <p>Developed and maintained principally by members of <a href="https://www.cbisrael.org">Congregation Beth Israel</a>, the oldest synagogue in Maine, we frame features around established synagogue needs.</p>
                        </div>
                        <div className="card-footer">
                            <Link to={`${path}/portal-signup`} className="btn btn-primary">Sign Your Shul Up!</Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 mt-5">
                    <div className="card m-3" style={cardStyle}>
                        <Switch>
                            <Route path={`${path}/login`} component={Login} />
                            <Route path={`${path}/register`} component={Register} />
                            <Route path={`${path}/verify-email`} component={VerifyEmail} />
                            <Route path={`${path}/forgot-password`} component={ForgotPassword} />
                            <Route path={`${path}/reset-password`} component={ResetPassword} />
                        </Switch>
                    </div>
                </div>
            </div>
            <div id="photoCredit" className="bottomrightbox">
                
            </div>
        </div>
    );
}

export { Account };