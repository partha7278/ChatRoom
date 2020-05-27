import React from 'react';
import ReactDOM from 'react-dom';
import { sentryUrl,useSentry }  from './config.json';
import * as Sentry from '@sentry/browser';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

if(useSentry >= 1){
    Sentry.init({dsn: sentryUrl });
}

ReactDOM.render(<App />, document.querySelector('#root'));