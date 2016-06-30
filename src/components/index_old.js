import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux';

import { compose, createStore } from 'redux';

import { Router, browserHistory, Route, IndexRoute } from 'react-router';

import reducer from './components/reducer';

/* Creating a store which will store all the data */
const DevTools = require('./components/helpers/DevTools/DevTools').default;
console.log('dev tools');
console.log(DevTools);
const store = compose(
  DevTools.instrument()
)(createStore)(reducer);

import Login from './components/Login/Login';
import Inventory from './components/Inventory/Inventory';

const main = (
  <Router history = { browserHistory }>
    <DevTools />
    {/*
    <Route path="/" component={ Login } />
    */}
    <Route path="/" component={ Inventory } />
  </Router>
);

let html  =   document.getElementById('root');

ReactDOM.render(
  <Provider store={ store } key="provider">
    { main }
  </Provider>,
  html
);

