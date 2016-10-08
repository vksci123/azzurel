/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import {Provider} from 'react-redux';
import {Router, browserHistory, Route, IndexRoute } from 'react-router';
import {syncHistory} from 'redux-simple-router';
import {compose, createStore, applyMiddleware} from 'redux';

import {
  Login,
  Inventory,
  RetailerInventory,
  RetailerStock,
  CreateStock,
  ViewStock,
  Customer,
  CustomerWrapper,
  Invoice,
  InvoiceView,
  InvoiceWrapper,
  ReportWrapper,
  InvoicePrint,
  TransferPrint,
  CustomerView,
  NotFound,
  Transfer,
  TransferWrapper
} from './components'; // eslint-disable-line no-unused-vars

import {loadCredentials} from './components/Login/Actions';
// import {loadSchema} from './components/Bills/DataActions';

import initSocket from './helpers/initSocket';
import reducer from './reducer';

/* ****************************************************************** */

// Create the store
const DevTools = require('./helpers/DevTools/DevTools');
console.log(DevTools);
const reduxSimpleRouterMiddleware = syncHistory(browserHistory);
const _finalCreateStore = compose(
  applyMiddleware(thunk, reduxSimpleRouterMiddleware, createLogger()),
  /* The following two lines are used for time travel and debug functionality
   * So how it works
   *  1. It connects to a store and sends the output to the dock monitor which is your chrome extension
  */
  DevTools.instrument(),
  require('redux-devtools').persistState( window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const store = _finalCreateStore(reducer);

/* ****************************************************************** */

// Enable hot reloading
if (__DEVELOPMENT__ && module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(require('./reducer'));
  });
}
// FIXME: Required for replaying actions from devtools to work
// reduxSimpleRouterMiddleware.listenForReplays(store);

global.socket = initSocket();


/* ****************************************************************** */

// Main routes and rendering

const requireLoginAndSchema = (nextState, replaceState, cb) => {
  console.log(store.getState());
  const {loginState: {credentials} } = store.getState();
  if (credentials) {
    cb();
    return;
  }
  Promise.all([
    store.dispatch(loadCredentials()),
    // store.dispatch(loadSchema())
  ]).then(
    () => {
      cb();
    },
    () => {
      replaceState(null, '/login'); cb();
    }
  );
};

const checkLogin = (nextState, replaceState, cb) => {
  console.log(store.getState());
  const {loginState: {credentials} } = store.getState();
  if (credentials) {
    console.log('User is already logged in!! Redirecting....');
    if ( credentials.hasura_roles[1] === 'user' || credentials.hasura_roles[1] === 'billing') {
      replaceState(null, '/invoice');
    } else {
      replaceState(null, '/inventory');
    }
    cb();
    return;
  }
  Promise.all([
    store.dispatch(loadCredentials()),
    // store.dispatch(loadSchema())
  ]).then(
    () => {
      console.log('User is already logged in!! Redirecting....');
      const creds = store.getState().loginState.credentials;
      if ( creds.hasura_roles[1] === 'user' || creds.hasura_roles[1] === 'billing') {
        replaceState(null, '/invoice');
      } else {
        replaceState(null, '/inventory');
      }
      cb();
    },
    () => {
      console.log('Login to continue....');
      cb();
    }
  );
};

const main = (
    <Router history={browserHistory}>
      <Route path="/login" component={Login} onEnter={ checkLogin } />
      <Route path="/" component={Inventory} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={ViewStock} />
        <Route path="inventory" component={ViewStock} />
        <Route path="inventory/create" component={CreateStock} />
      </Route>
      <Route path="/retailer_stock" component={RetailerInventory} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={RetailerStock} />
      </Route>
      <Route path="/customer" component={CustomerWrapper} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={ CustomerView } />
        <Route path="create" component={Customer} />
      </Route>
      <Route path="/invoice" component={InvoiceWrapper} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={ Invoice } />
      </Route>
      <Route path="/transfer" component={TransferWrapper} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={ Transfer } />
      </Route>
      <Route path="/invoice/view" component={ReportWrapper} onEnter={ requireLoginAndSchema } >
        <IndexRoute component={ InvoiceView } />
      </Route>
      <Route path="/generate_invoice/:Id" component={InvoicePrint} onEnter={ requireLoginAndSchema } />
      <Route path="/generate_transfer/:Id" component={TransferPrint} onEnter={ requireLoginAndSchema } />
      <Route path="*" component={NotFound} onEnter={ requireLoginAndSchema } />
    </Router>
);

const dest = document.getElementById('content');
ReactDOM.render(
  <Provider store={store} key="provider">
    {main}
  </Provider>,
  dest
);

/* ****************************************************************** */

// FIXME: No idea what the hell seems to be going on here.

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  // FIXME:
  // if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
  //   console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  // }
}

// if (__DEVTOOLS__ && !window.devToolsExtension) {
//   ReactDOM.render(
//     <Provider store={store} key="provider">
//       <div>
//         {component}
//         <DevTools />
//       </div>
//     </Provider>,
//     dest
//   );
// }
