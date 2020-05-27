import React from 'react';
import ErrorBoundary from './components/ErrorBoundry';
import { BrowserRouter, Route,Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Join from './components/Join';
import Chat from './components/Chat';



const App = () => (

    <ErrorBoundary>
        <ToastContainer />
        <BrowserRouter>
            <Switch>
                <Route path="/chat" exact component={Chat} />
                <Route path="/" component={Join} />
            </Switch>
        </BrowserRouter>
    </ErrorBoundary>
    
);

export default App;