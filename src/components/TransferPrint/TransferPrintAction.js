/* Action file for Inventory */

import { defaultTransferPrintState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

/* Action Constants */

const TRANSFER_FETCHED = '@transferprint/TRANSFER_FETCHED';
const ERROR_HANDLING = '@transferprint/ERROR_HANDLING';
/* End of it */

/* Action creators */

const fetchTransfer = ( transferId ) => {
  return (dispatch) => {
    const url = Endpoints.db + '/retail_product/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'inventory',
        'columns': ['*']
      },
      {
        'name': 'retailer',
        'columns': ['*']
      }
    ];
    selectObj.where = {
      'tra_code': {
        '$eq': transferId
      }
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-role': 'admin'},
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, TRANSFER_FETCHED, ERROR_HANDLING));
  };
};

/* End of it */

/* Inventory Reducer */

const transferPrintReducer = ( state = defaultTransferPrintState, action ) => {
  switch ( action.type ) {
    case TRANSFER_FETCHED:
      return { ...state, transferDetails: action.data };
    default:
      return state;
  }
};

export default transferPrintReducer;

export {
  fetchTransfer
};
