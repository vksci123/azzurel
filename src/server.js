import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import path from 'path';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import httpProxy from 'http-proxy';

//SSR stuff
import { match, RoutingContext } from 'react-router'
global.__DISABLE_SSR__ = true;

//Express middleware
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

const proxy = httpProxy.createProxyServer({
  target: 'http://130.211.255.73',
});

app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use('/rstatic', Express.static(path.join(__dirname, '..', 'static')));

//Proxy to hasura
app.use('/db', (req, res) => {
  proxy.web(req, res, {target: 'http://130.211.255.73/db'});
});
app.use('/auth', (req, res) => {
  proxy.web(req, res, {target: 'http://130.211.255.73/auth'});
});

//FIXME:
const myReducer = (state, action) => {
  return state;
};

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  /* I commented it out because it had no purpose */
  //const client = new ApiClient(req);

  const assets = webpackIsomorphicTools.assets();

  // Initialize the store here
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} />)
    );
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  // FIXME: Add SSR
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('server is running on port %s', config.port);
    // console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    // console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
