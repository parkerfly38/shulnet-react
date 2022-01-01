import React from 'react';
import config from 'config';

import { accountService, portalService } from '@/_services';

function Home() {
    const user = accountService.userValue;
    if (!portalService.portalValue)
    {
        portalService.getById(config.portalId);
    }
    const portal = portalService.portalValue;
    
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hello, {user.firstName}!</h1>
                <p>Welcome to the member portal for { portal[0].institution_name }.</p>
            </div>
        </div>
    );
}

export { Home };