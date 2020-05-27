import * as Sentry from '@sentry/browser';
import { useSentry }  from './config.json';


export default function (err){
    
    if(useSentry >= 2){
        Sentry.captureException(err);
    }
}