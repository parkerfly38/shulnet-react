import React from 'react';
import config from 'config';

import { accountService, profileService } from '@/_services';

function Home() {
    const user = accountService.userValue;
    const profile = 

    return (
        <div className="p-4">
            <div className="container">
                <h1>Hello, {user.firstName}!</h1>
                <p>Welcome to the member portal for {}.</p>
            </div>
        </div>
    );
}

export { Home };