import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { accountService } from '@/_services';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

import './styles.module.less';

function Account({ history, match }) {
    const { path } = match;

    useEffect(() => {
        document.body.classList.add('bodybg');
        // redirect to home if already logged in
        if (accountService.userValue) {
            history.push('/');
        }
        return () => {
            document.body.classList.remove("bodybg");
        }
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 mt-5">
                    <div className="card m-3">
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
            <div class="bottomrightbox">
                Photo by <a href="https://unsplash.com/@bokcily?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Boris Ivanović</a> on <a href="https://unsplash.com/s/photos/synagogue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
            </div>
        </div>
    );
}

export { Account };