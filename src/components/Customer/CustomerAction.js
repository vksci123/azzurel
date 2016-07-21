/* Action file for Inventory */

import { defaultCustomerState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

import { routeActions } from 'redux-simple-router';

/* Action constants */

const SEARCH_ENTERED = '@customer/SEARCH_ENTERED';
const ERROR_HANDLING = '@customer/ERROR_HANDLING';
const UPDATE_CONSUMER_INFO = '@customer/UPDATE_CONSUMER_INFO';
const RESET_SEARCH = '@customer/RESET_SEARCH';
const SEARCH_INPUT = '@customer/SEARCH_INPUT';

const INPUT_VALUE_CHANGED = '@customer/INPUT_VALUE_CHANGED';
const CUSTOMER_DATA_FETCHED = '@customer/CUSTOMER_DATA_FETCHED';

const RESET_CONSUMER_DATA = '@customer/RESET_CONSUMER_DATA';

/* Action creators */
const searchCustomer = (input) => {
  return (dispatch) => {
    const url = Endpoints.db + '/customer/select';
    const selectObj = {};
    selectObj.columns = [
      '*'
    ];
    selectObj.order_by = '-id';
    selectObj.where = {
      '$or': [
        {
          'name': {
            '$ilike': '%' + input + '%'
          }
        },
        {
          'email': {
            '$ilike': '%' + input + '%'
          }
        },
        {
          'contact_no': {
            '$eq': (parseInt(input, 10) ? parseInt(input, 10) : 0)
          }
        }
      ]
    };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };

    dispatch( { type: SEARCH_INPUT, data: input });

    return dispatch(requestAction(url, options, SEARCH_ENTERED, ERROR_HANDLING));
  };
};

const loadCustomerInformation = ( id ) => {
  return (dispatch, getState) => {
    const currentState = getState();

    const selectedConsumerInfo = currentState.customer_data.recommendations.filter( ( data ) => {
      return (
            data.id === id
          );
    });

    if ( selectedConsumerInfo.length > 0) {
      /* DO someting */
      dispatch( { type: UPDATE_CONSUMER_INFO, data: selectedConsumerInfo[0] });
    } else {
      alert('Customer not found');
    }
  };
};

const insertCustomer = () => {
  return (dispatch, getState) => {
    const currState = getState().customer_data;
    const customerObj = {};
    const customerInsertObj = {};
    const url = Endpoints.db + '/customer/insert';

    customerObj.name = currState.name;
    customerObj.email = currState.email;
    customerObj.contact_no = parseInt(currState.contact_no, 10);
    customerObj.address = currState.address;

    customerInsertObj.objects = [
      customerObj
    ];
    customerInsertObj.returning = ['id', 'name', 'email', 'contact_no', 'address'];

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(customerInsertObj),
    };

    // dispatch( { type: SEARCH_INPUT, data: input });

    return dispatch(requestAction(url, options))
      .then( (resp) => {
        if ( resp.returning.length > 0) {
          alert('Customer Created');
          dispatch({ type: UPDATE_CONSUMER_INFO, data: resp.returning[0] });
          return dispatch(routeActions.push('/invoice'));
        }
      })
      .catch( (resp) => {
        console.log(resp);
        alert('something went wrong while inserting customer');
      });
  };
};

/* Customer Operations */
const fetchCustomerData = () => {
  return (dispatch) => {
    const url = Endpoints.db + '/customer/select';
    const selectObj = {};
    selectObj.columns = [
      '*'
    ];
    selectObj.order_by = '-id';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };

    return dispatch(requestAction(url, options, CUSTOMER_DATA_FETCHED, ERROR_HANDLING));
  };
};

const deleteCustomerData = (customerId) => {
  return (dispatch) => {
    const deleteObj = {};
    const url = Endpoints.db + '/customer/delete';
    deleteObj.where = {
      'id': parseInt(customerId, 10)
    };
    deleteObj.returning = ['id'];
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(deleteObj),
    };

    return dispatch(requestAction(url, options))
      .then( ( resp ) => {
        console.log(resp);
        alert('deleted');
        return dispatch(fetchCustomerData());
      })
      .catch( ( resp ) => {
        console.log(resp);
        alert('error');
      });
  };
};

const cancelCustomer = () => {
  return (dispatch) => {
    dispatch({ type: RESET_CONSUMER_DATA });
    return dispatch(routeActions.push('/invoice'));
  };
};

/* End of it */

/* */

/* Inventory Reducer */

const customerReducer = ( state = defaultCustomerState, action ) => {
  let consumerInfo;
  switch ( action.type ) {
    case INPUT_VALUE_CHANGED:
      /* Will send field type and the data */
      const currentInput = {};
      currentInput[ action.data.fieldType ] = action.data.value;
      console.log(currentInput);
      return { ...state, ...currentInput };
    case SEARCH_ENTERED:
      /* Will send field type and the data */
      return { ...state, recommendations: action.data};
    case RESET_SEARCH:
      consumerInfo = {};
      consumerInfo.name = '';
      consumerInfo.email = '';
      consumerInfo.contact_no = 0;
      consumerInfo.address = '';
      return { ...state, recommendations: [], ...consumerInfo, search: '', customerFound: false};
    case UPDATE_CONSUMER_INFO:
      consumerInfo = {};
      consumerInfo.name = action.data.name;
      consumerInfo.email = action.data.email;
      consumerInfo.contact_no = action.data.contact_no;
      consumerInfo.address = action.data.address;
      consumerInfo.id = action.data.id;
      return { ...state, ...consumerInfo, recommendations: [], search: '', customerFound: true};
    case ERROR_HANDLING:
      return { ...state, customerFound: false};
    case SEARCH_INPUT:
      return { ...state, search: action.data};
    case CUSTOMER_DATA_FETCHED:
      return { ...state, fetchedCustomer: action.data };
    case RESET_CONSUMER_DATA:
      return { ...defaultCustomerState };
    default:
      return state;
  }
};

export default customerReducer;

export {
  SEARCH_ENTERED,
  searchCustomer,
  RESET_SEARCH,
  loadCustomerInformation,
  INPUT_VALUE_CHANGED,
  insertCustomer,
  fetchCustomerData,
  deleteCustomerData,
  RESET_CONSUMER_DATA,
  cancelCustomer
};
