/* Action file for Inventory */

import { defaultLeftNavBarState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

/* Action constants */

const MODULES_FETCHED = '@left_nav/MODULES_FETCHED';
const ERROR_HANDLING = '@left_nav/ERROR_HANDLING';

/* Action creators */

const fetchModules = ( role ) => {
  return (dispatch) => {
    const url = Endpoints.db + '/role_based_module/select';
    const selectObj = {};
    selectObj.columns = [
      '*'
    ];
    selectObj.order_by = '+module_sequence';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Hasura-Role': role},
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, MODULES_FETCHED, ERROR_HANDLING));
  };
};

/* */

/* Inventory Reducer */

const leftBarReducer = ( state = defaultLeftNavBarState, action ) => {
  switch ( action.type ) {
    case MODULES_FETCHED:
      return { ...state, modules: action.data };
    case ERROR_HANDLING:
      return { ...state, error: true};
    default:
      return state;
  }
};

export default leftBarReducer;

export {
  fetchModules
};
