/* Action file for Inventory */

import { defaultInvoicePrintState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

/* Action Constants */

const ORDER_FETCHED = '@invoiceprint/ORDER_FETCHED';
const ERROR_HANDLING = '@invoiceprint/ERROR_HANDLING';
/* End of it */

/* Action creators */

const fetchOrder = (orderId) => {
  return (dispatch) => {
    const url = Endpoints.db + '/order/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'order_items',
        'columns': ['*', { 'name': 'parent_product', 'columns': ['*']}]
      },
      {
        'name': 'customer',
        'columns': ['*']
      }
    ];
    selectObj.where = {
      'id': {
        '$eq': parseInt(orderId, 10)
      }
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, ORDER_FETCHED, ERROR_HANDLING));
  };
};

/* End of it */

/* Inventory Reducer */

const invoicePrintReducer = ( state = defaultInvoicePrintState, action ) => {
  switch ( action.type ) {
    case ORDER_FETCHED:
      return { ...state, orderDetails: action.data[0] };
    default:
      return state;
  }
};

export default invoicePrintReducer;

export {
  fetchOrder
};
