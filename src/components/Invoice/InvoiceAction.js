/* Action file for Inventory */

import { defaultInvoiceState } from '../Common/DefaultState';

import Endpoints from '../../Endpoints';

import requestAction from '../Common/requestAction';

import { routeActions } from 'redux-simple-router';

import { generateOptions } from '../Common/commonFunctions';

/* Action Constants */

const UPDATE_CUSTOMER_INFO = '@invoice/UPDATE_CUSTOMER_INFO';
const PRODUCT_FETCHED = '@invoice/PRODUCT_FETCHED';
const RETAILER_FETCHED = '@invoice/RETAILER_FETCHED';
const ERROR_HANDLING = '@invoice/ERROR_HANDLING';
const DEL_ITEM = '@invoice/DEL_ITEM';
const UPDATE_BAR_CODE = '@invoice/UPDATE_BAR_CODE';
const UPDATE_QUANTITY = '@invoice/UPDATE_QUANTITY';
const PAYMENT_OPTION_CHANGE = '@invoice/PAYMENT_OPTION_CHANGE';

const ORDER_FETCHED = '@invoice/ORDER_FETCHED';

const RESET_INVOICE_DATA = '@invoice/RESET_INVOICE_DATA';

/* End of it */

/* Action creators */
const updateCustomerInfo = () => {
  return (dispatch, getState) => {
    const currState = getState().customer_data;

    return dispatch( { type: UPDATE_CUSTOMER_INFO, data: currState });
  };
};

const fetchProduct = (input) => {
  return (dispatch, getState) => {
    const url = Endpoints.db + '/retail_product/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'inventory',
        'columns': ['*',
          {
            'name': 'orders',
            'columns': ['id', 'quantity']
          }
        ]
      }
    ];
    selectObj.order_by = '-id';
    selectObj.where = {
      'inventory': {
        'bar_code': {
          '$eq': input
        }
      }
    };

    const genOpt = generateOptions( getState().loginState.credentials );
    if ( Object.keys(genOpt).length === 0 ) {
      alert('Users role not detected');
      return false;
    }
    const options = {
      ...genOpt,
      body: JSON.stringify(selectObj)
    };

    return dispatch(requestAction(url, options, PRODUCT_FETCHED, ERROR_HANDLING));
  };
};

const getRetailerPosInfo = () => {
  return (dispatch, getState) => {
    const url = Endpoints.db + '/retailer_pos/select';
    const selectObj = {};
    selectObj.columns = [
      'id', 'name', 'contact_no'
    ];

    const genOpt = generateOptions( getState().loginState.credentials );
    if ( Object.keys(genOpt).length === 0 ) {
      alert('Users role not detected');
      return false;
    }
    const options = {
      ...genOpt,
      body: JSON.stringify(selectObj)
    };

    return dispatch(requestAction(url, options, RETAILER_FETCHED, ERROR_HANDLING));
  };
};

const createInvoice = () => {
  return (dispatch, getState) => {
    const currState = getState().invoice_data;
    const orderInsertObj = {};
    const orderObj = {};
    const orderObjUrl = Endpoints.db + '/order/insert';
    let orderId = 0;

    /* Check for customer id */

    if (!getState().customer_data.id) {
      alert('Please select customer to proceed with the billing');
      return dispatch({ type: ERROR_HANDLING });
    }

    if ( Object.keys(currState.items).length === 0) {
      alert('Please select items to proceed with the billing');
      return dispatch({ type: ERROR_HANDLING });
    }

    orderObj.vat_applied = parseFloat('12.5');
    orderObj.customer_id = getState().customer_data.id;
    orderObj.retailer_id = currState.retailerId;
    orderObj.payment_type = currState.paymentType;
    orderObj.created_at = new Date().toISOString();
    orderObj.updated_at = new Date().toISOString();

    orderInsertObj.objects = [ orderObj ];
    orderInsertObj.returning = ['id'];

    const genOpt = generateOptions( getState().loginState.credentials );
    if ( Object.keys(genOpt).length === 0 ) {
      alert('Users role not detected');
      return false;
    }

    const options = {
      ...genOpt,
      body: JSON.stringify(orderInsertObj)
    };
    return dispatch(requestAction(orderObjUrl, options))
      .then( ( resp ) => {
        if (resp.returning.length > 0) {
          orderId = resp.returning[0].id;
          let orderItemObj = {};
          const orderItemObjs = [];
          const orderItemUrl = Endpoints.db + '/order_item/insert';

          Object.keys( currState.items ).map( ( item ) => {
            orderItemObj = {};
            orderItemObj.parent_product_id = parseInt(item, 10);
            orderItemObj.order_id = resp.returning[0].id;
            orderItemObj.name = currState.items[item].inventory.name;
            orderItemObj.purchase_price = currState.items[item].price_per_qty;
            orderItemObj.color = currState.items[item].inventory.colour;
            orderItemObj.size = currState.items[item].inventory.size;
            orderItemObj.discount = 0;
            orderItemObj.quantity = currState.quantity[currState.items[item].inventory.bar_code];
            orderItemObjs.push(orderItemObj);
          });

          const orderItemInsertObj = {};
          orderItemInsertObj.objects = orderItemObjs;
          orderItemInsertObj.returning = ['id'];

          options.body = JSON.stringify(orderItemInsertObj);

          return dispatch(requestAction(orderItemUrl, options));
        }
        alert('something wrong happened while creating the order');
      })
      .then( (resp) => {
        console.log(resp);
        alert('successfully created');
        return dispatch(routeActions.push('/generate_invoice/' + orderId));
      })
      .catch( ( resp ) => {
        console.log(resp);
        alert('order creation failed');
      });
  };
};

const fetchInvoiceData = () => {
  return (dispatch, getState) => {
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

    const genOpt = generateOptions( getState().loginState.credentials );
    if ( Object.keys(genOpt).length === 0 ) {
      alert('Users role not detected');
      return false;
    }

    const options = {
      ...genOpt,
      body: JSON.stringify(selectObj)
    };

    return dispatch(requestAction(url, options, ORDER_FETCHED, ERROR_HANDLING));
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
        product[action.data[0].inventory.id] = action.data[0];
        let soldQuantity = 0;
        const retailerId = action.data[0].retailer_id;

        const totalQuantity = action.data[0].qty;

        action.data[0].inventory.orders.forEach( ( order ) => {
          soldQuantity += order.quantity;
        });

        if ( totalQuantity - soldQuantity === 0 ) {
          alert('product is unavailable');
          return { ...state };
        }
        product[action.data[0].inventory.id].available_quantity = totalQuantity - soldQuantity;
        /* Default Quantity is 1 */
        const quantity = {};
        quantity[action.data[0].inventory.bar_code] = 1;
        return { ...state, items: { ...state.items, ...product }, barCode: '', productFetched: true, quantity: { ...state.quantity, ...quantity }, retailerId: retailerId};
      }
      return { ...state, productFetched: false};
    case RETAILER_FETCHED:
      return { ...state, retailerInfo: action.data };
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
      return { ...defaultInvoiceState };
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
  UPDATE_QUANTITY,
  createInvoice,
  PAYMENT_OPTION_CHANGE,
  fetchInvoiceData,
  RESET_INVOICE_DATA,
  getRetailerPosInfo
};
