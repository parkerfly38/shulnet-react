import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import { history } from './_helpers';
import { accountService, portalService } from './_services';
import { App } from './app';
import config from 'config';

import './styles.less';
import './react-big-calendar.css';

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

//get portal settings before startup
const portalId = config.portalId;
const portal = portalService.getById(portalId);

// attempt silent token refresh before startup
accountService.refreshToken().finally(startApp);

function startApp() {
    render(
        <Router history={history}>
            <App />
        </Router>,
        document.getElementById('app')
    );
}