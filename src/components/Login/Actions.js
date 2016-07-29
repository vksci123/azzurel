/* State

{
  ongoingRequest : false, //true if request is going on
  lastError : null OR <string>
  lastSuccess: null OR <string>
}

*/

import fetch from 'isomorphic-fetch';
import { routeActions } from 'redux-simple-router';
import Endpoints, {globalCookiePolicy} from '../../Endpoints';

import requestAction from '../Common/requestAction';

const MAKE_REQUEST = 'Login/MAKE_REQUEST';
const REQUEST_SUCCESS = 'Login/REQUEST_SUCCESS';
const REQUEST_ERROR = 'Login/REQUEST_ERROR';

const RESET = 'Login/RESET';

const INPUT_VALUE_CHANGED = '@login/INPUT_VALUE_CHANGED';

// HTML Component defines what state it needs
// HTML Component should be able to emit actions
// When an action happens, the state is modified (using the reducer function)
// When the state is modified, anybody dependent on the state is asked to update
// HTML Component is listening to state, hence re-renders


const defaultState = {ongoingRequest: false, lastError: '', lastSuccess: null, credentials: null, username: '', password: ''};
const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case MAKE_REQUEST:
      return {...state, ongoingRequest: true, lastSuccess: null, lastError: null};
    case REQUEST_SUCCESS:
      return {...state, ongoingRequest: false, lastSuccess: action.data, lastError: '', credentials: action.data};
    case REQUEST_ERROR:
      return {...state, ongoingRequest: false, lastError: action.data, lastSuccess: null};
    case INPUT_VALUE_CHANGED:
      const obj = {};
      obj[action.data.key] = action.data.value;
      return { ...state, ...obj };
    case RESET:
      return { ...defaultState };
    default: return state;
  }
};

const requestSuccess = (data) => ({type: REQUEST_SUCCESS, data: data});
const requestFailed = (data) => ({type: REQUEST_ERROR, data: data});

const makeRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: MAKE_REQUEST});
    const loginData = {};
    // const creds = getState().loginState.credentials;
    console.log(data);
    loginData.username = data.username;
    loginData.password = data.password;
    const options = {
      method: 'POST',
      body: JSON.stringify(loginData),
      credentials: globalCookiePolicy,
      headers: { 'Content-Type': 'application/json' }
    };
    return dispatch(requestAction(Endpoints.login, options))
      .then( ( response ) => {
        const creds = response;
        const retPropRedirect = ( ) => {
          if ( creds.hasura_roles[1] === 'user' || creds.hasura_roles[1] === 'billing') {
            return '/invoice';
          }
          return '/inventory';
        };
        return Promise.all([
          dispatch(requestSuccess(response)),
          dispatch( routeActions.push(retPropRedirect()) )
        ]);
      })
      .catch( ( error ) => {
        console.log(error);
        return dispatch(requestFailed(error.message));
      });
      /*
    return fetch(Endpoints.login, options)
           .then(
             (response) => {
               if (response.ok) { // 2xx status
                 const creds = response.json();
                 const retPropRedirect = ( ) => {
                   if ( creds.hasura_roles[1] === 'user' || creds.hasura_roles[1] === 'billing') {
                     return routeActions.push('/invoice');
                   }
                   return routeActions.push('/inventory');
                 };
                 return Promise.all([
                   dispatch(requestSuccess(response.json())),
                   dispatch(retPropRedirect)
                 ]);
               }
               return dispatch(requestFailed('Error. Try again!'));
             },
             (error) => {
               console.log(error);
               return dispatch(requestFailed(error.text));
             });
            */
  };
};

const loadCredentials = () => {
  return (dispatch) => {
    const p1 = new Promise((resolve, reject) => {
      fetch(Endpoints.getCredentials, {credentials: globalCookiePolicy}).then(
        (response) => {
          if (response.ok) {
            response.json().then(
              (creds) => {
                dispatch(requestSuccess(creds));
                resolve();
              },
              () => { reject(); }
            );
          } else {
            reject();
          }
        },
        () => { reject(); }
      );
    });
    return p1;
  };
};

export default loginReducer;
export {makeRequest, requestSuccess, requestFailed, loadCredentials, INPUT_VALUE_CHANGED, RESET};
