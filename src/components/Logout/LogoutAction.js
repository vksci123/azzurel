
import requestAction from '../Common/requestAction';
import EndPoints, { globalCookiePolicy } from '../../Endpoints';

import { RESET } from '../Login/Actions';
import { routeActions } from 'redux-simple-router';

const logout = () => {
  return ( dispatch ) => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(EndPoints.logout, options))
      .then( ( resp ) => {
        if ( resp.message === 'Logged out' ) {
          dispatch({ type: RESET} );
          return dispatch(routeActions.push('/login'));
        }
        throw Error('Sorry cannot logout');
      })
      .catch( ( error ) => {
        alert('Error: ' + error);
      });
  };
};

export {
  logout
};
