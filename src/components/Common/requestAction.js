import fetch from 'isomorphic-fetch';

/* importing necessary actions to make sure that page loads are shown */
import { MAKE_REQUEST
  , REQUEST_COMPLETED
} from './Actions';

/* Function to mark the reception of the response */
const completeReq = (dispatch) => {
  return dispatch({ type: REQUEST_COMPLETED });
};

const requestAction = (url, options, SUCCESS, ERROR) => {
  if (!(options.credentials)) {
    options.credentials = 'include';
  }
  return (dispatch) => {
    /* Marking the start of the request */
    dispatch( { type: MAKE_REQUEST });
    /* End of it */
    const p1 = new Promise( (resolve, reject) => {
      fetch( url, options).then(
        (response) => {
          if (response.ok) {
            return response.json().then((results) => {
              completeReq(dispatch);
              if (SUCCESS) {
                dispatch({type: SUCCESS, data: results});
              }
              resolve(results);
            });
          }
          if (response.status >= 400 && response.status < 500) {
            return response.json().then((errorMsg) => {
              completeReq(dispatch);
              if (ERROR) {
                dispatch({ type: ERROR, data: errorMsg});
              }
              reject(errorMsg);
            });
          }
          /* completing the request as the response for it has been received */
          completeReq(dispatch);
          if (ERROR) {
            dispatch({type: ERROR, response});
          }
          reject();
        },
        (error) => {
          completeReq(dispatch);
          if (ERROR) {
            dispatch({
              type: ERROR, code: 'server-connection-failed',
              message: error.message
            });
          }
          reject(error);
        }
      );
    });
    return p1;
  };
};

export default requestAction;
