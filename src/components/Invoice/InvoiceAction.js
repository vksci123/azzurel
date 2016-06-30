/* Action file for Inventory */

import { defaultInvoiceState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

/* Action Constants */

const UPDATE_CUSTOMER_INFO = '@invoice/UPDATE_CUSTOMER_INFO';
const PRODUCT_FETCHED = '@invoice/PRODUCT_FETCHED';
const ERROR_HANDLING = '@invoice/ERROR_HANDLING';
const DEL_ITEM = '@invoice/DEL_ITEM';
const UPDATE_BAR_CODE = '@invoice/UPDATE_BAR_CODE';
const UPDATE_QUANTITY = '@invoice/UPDATE_QUANTITY';

/* End of it */

/* Action creators */
const updateCustomerInfo = () => {
  return (dispatch, getState) => {
    const currState = getState().customer_data;

    return dispatch( { type: UPDATE_CUSTOMER_INFO, data: currState });
  };
};

const fetchProduct = (input) => {
  return (dispatch) => {
    const url = Endpoints.db + '/inventory/select';
    const selectObj = {};
    selectObj.columns = [
      '*'
    ];
    selectObj.order_by = '-id';
    selectObj.where = {
      'bar_code': {
        '$eq': input
      }
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, PRODUCT_FETCHED, ERROR_HANDLING));
  };
};

/* End of it */

/* Inventory Reducer */

const invoiceReducer = ( state = defaultInvoiceState, action ) => {
  switch ( action.type ) {
    case UPDATE_CUSTOMER_INFO:
      return { ...state, customer_available: (action.data.name.length > 0 ? true : false ) };
    case PRODUCT_FETCHED:
      const product = {};
      if ( action.data.length > 0) {
        product[action.data[0].id] = action.data[0];
        /* Default Quantity is 1 */
        const quantity = {};
        quantity[action.data[0].bar_code] = 1;
        return { ...state, items: { ...state.items, ...product }, barCode: '', productFetched: true, quantity: { ...state.quantity, ...quantity }};
      }
      return { ...state, productFetched: false};
    case DEL_ITEM:
      const products = Object.assign({}, state.items);
      const quantity = Object.assign({}, state.quantity);
      const barCode = products[action.data].bar_code;
      delete products[action.data];
      delete quantity[barCode];
      return { ...state, items: { ...products }, quantity: { ...quantity }};
    case UPDATE_BAR_CODE:
      return { ...state, barCode: action.data, productFetched: false};
    case UPDATE_QUANTITY:
      const obj = {};
      obj[action.data.barCode] = action.data.quantity;
      return { ...state, quantity: { ...state.quantity, ...obj }};
    default:
      return state;
  }
};

export default invoiceReducer;

export {
  updateCustomerInfo,
  fetchProduct,
  DEL_ITEM,
  UPDATE_BAR_CODE,
  UPDATE_QUANTITY
};
