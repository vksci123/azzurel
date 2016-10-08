/* Action file for Inventory */

import { defaultTransferState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

import { routeActions } from 'redux-simple-router';

/* Action Constants */

const PRODUCT_FETCHED = '@transfer/PRODUCT_FETCHED';

const RETAILER_FETCHED = '@transfer/RETAILER_FETCHED';
const UPDATE_RETAILER = '@transfer/UPDATE_RETAILER';

const ERROR_HANDLING = '@transfer/ERROR_HANDLING';
const DEL_ITEM = '@transfer/DEL_ITEM';
const UPDATE_BAR_CODE = '@transfer/UPDATE_BAR_CODE';
const UPDATE_QUANTITY = '@transfer/UPDATE_QUANTITY';
const PAYMENT_OPTION_CHANGE = '@transfer/PAYMENT_OPTION_CHANGE';

const ORDER_FETCHED = '@transfer/ORDER_FETCHED';

const RESET_INVOICE_DATA = '@transfer/RESET_INVOICE_DATA';

const UPDATE_INPUT = '@transfer/UPDATE_INPUT';

/* End of it */

/* Action creators */

const fetchProduct = (input) => {
  return (dispatch) => {
    const url = Endpoints.db + '/inventory/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'orders',
        'columns': ['id', 'quantity']
      },
      {
        'name': 'stocks',
        'columns': ['id', 'quantity']
      },
      {
        'name': 'retailer_stocks',
        'columns': ['id', 'qty']
      }
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

const createTransfer = () => {
  return (dispatch, getState) => {
    const currState = getState().transfer_data;
    console.log('curr');
    console.log(currState);

    if ( currState.selectedRetailerId.length === 0 ) {
      alert('Please select the retailer to proceed');
      return false;
    }

    if ( Object.keys(currState.items).length === 0) {
      alert('Please select items to proceed with the billing');
      return dispatch({ type: ERROR_HANDLING });
    }

    let inventoryItemObj = {};
    const inventoryItemObjs = [];
    const inventoryObjUrl = Endpoints.db + '/retail_product/insert';

    function randomString(length, chars) {
      let result = '';
      for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    const rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    Object.keys( currState.items ).map( ( item ) => {
      inventoryItemObj = {};
      inventoryItemObj.inventory_id = parseInt(item, 10);
      inventoryItemObj.retailer_id = parseInt(currState.selectedRetailerId, 10);
      inventoryItemObj.qty = currState.quantity[currState.items[item].bar_code];
      inventoryItemObj.price_per_qty = currState.price[currState.items[item].bar_code];
      inventoryItemObj.tra_code = rString;
      inventoryItemObj.created_at = new Date().toISOString();
      inventoryItemObj.updated_at = new Date().toISOString();

      inventoryItemObjs.push(inventoryItemObj);
    });

    const inventoryItemInsertObj = {};
    inventoryItemInsertObj.objects = inventoryItemObjs;
    inventoryItemInsertObj.returning = ['id', 'tra_code'];

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-role': 'admin' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(inventoryItemInsertObj),
    };
    return dispatch(requestAction(inventoryObjUrl, options))
      .then( (resp) => {
        console.log(resp);
        alert('successfully created');
        return dispatch(routeActions.push('/generate_transfer/' + resp.returning[0].tra_code ));
      })
      .catch( ( resp ) => {
        console.log(resp);
        alert('transfer failed');
      });
  };
};

const fetchInvoiceData = () => {
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
    selectObj.order_by = '-created_at';

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, ORDER_FETCHED, ERROR_HANDLING));
  };
};

const fetchRetailerData = () => {
  return (dispatch) => {
    const url = Endpoints.db + '/retailer_shop/select';
    const selectObj = {};
    selectObj.columns = [
      '*'
    ];
    selectObj.where = {
      'is_active': true
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };
    return dispatch(requestAction(url, options, RETAILER_FETCHED, ERROR_HANDLING));
  };
};

/* End of it */

/* Inventory Reducer */

const transferReducer = ( state = defaultTransferState, action ) => {
  switch ( action.type ) {
    case PRODUCT_FETCHED:
      const product = {};
      if ( action.data.length > 0) {
        product[action.data[0].id] = action.data[0];
        let totalQuantity = 0;
        let soldQuantity = 0;

        action.data[0].stocks.forEach( ( stock ) => {
          totalQuantity += stock.quantity;
        });
        action.data[0].retailer_stocks.forEach( ( stock ) => {
          soldQuantity += stock.qty;
        });

        if ( totalQuantity - soldQuantity === 0 ) {
          alert('product is unavailable');
          return { ...state };
        }
        product[action.data[0].id].available_quantity = totalQuantity - soldQuantity;
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
    case PAYMENT_OPTION_CHANGE:
      return { ...state, paymentType: action.data };
    case ORDER_FETCHED:
      return { ...state, fetchedInvoice: action.data };
    case ERROR_HANDLING:
      return { ...state };
    case RESET_INVOICE_DATA:
      return { ...defaultTransferState };
    case RETAILER_FETCHED:
      return { ...state, retailerData: action.data };
    case UPDATE_RETAILER:
      return { ...state, selectedRetailerId: action.data };
    case UPDATE_INPUT:
      const itemObj = {};
      itemObj[action.data.barCode] = action.data.data ? parseInt(action.data.data, 10) : 0;
      if ( action.data.key === 'price' ) {
        return { ...state, price: { ...state.price, ...itemObj } };
      }
      return { ...state, discount: { ...state.discount, ...itemObj } };
    default:
      return state;
  }
};

export default transferReducer;

export {
  fetchProduct,
  DEL_ITEM,
  UPDATE_BAR_CODE,
  UPDATE_QUANTITY,
  createTransfer,
  PAYMENT_OPTION_CHANGE,
  fetchInvoiceData,
  RESET_INVOICE_DATA,
  fetchRetailerData,
  UPDATE_RETAILER,
  UPDATE_INPUT
};
