/* Action file for Inventory */

import { defaultInventoryState } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

import { routeActions } from 'redux-simple-router';

/* Action constants */

const INPUT_VALUE_CHANGED = '@inventory/INPUT_VALUE_CHANGED';
const INVENTORY_DATA_FETCHED = '@inventory/INVENTORY_DATA_FETCHED';
const ERROR_HANDLING = '@inventory/ERROR_HANDLING';

/* Action creators */
const uploadInventoryData = ( propS ) => {
  return (dispatch) => {
    const url = Endpoints.db + '/inventory/insert';
    const stockUrl = Endpoints.db + '/stock/insert';
    const insertObj = {};
    const stockObj = {};
    const stockReqObj = {};
    insertObj.name = propS.name;
    insertObj.bar_code = propS.bar_code;
    insertObj.colour = propS.colour;
    insertObj.price = propS.price;
    insertObj.nickname = propS.nickname;
    insertObj.size = propS.size;
    insertObj.discount = propS.discount;
    // insertObj.quantity = propS.quantity;
    const obj = {};
    obj.objects = [ insertObj ];
    obj.returning = ['id'];

    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(obj),
    };

    return dispatch(requestAction(url, options))
      .then( ( resp ) => {
        console.log(resp);
        if ( resp.returning.length > 0) {
          // Make a stock object
          stockObj.quantity = propS.quantity;
          stockObj.inventory_id = resp.returning[0].id;
          stockObj.date_added = new Date().toISOString();
          stockObj.inventory_number = 'n/a';
          stockReqObj.objects = [stockObj];
          stockReqObj.returning = ['id'];
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: globalCookiePolicy,
            body: JSON.stringify(stockReqObj),
          };
          return dispatch(requestAction(stockUrl, options));
        }
        alert('something went wrong while uploading inventory');
        return false;
      })
      .then( ( resp ) => {
        if ( resp.returning.length > 0) {
          alert('uploaded');
          return dispatch(routeActions.push('/inventory'));
        }
        alert('something went wrong while uploading stock');
        return false;
      })
      .catch( ( resp ) => {
        console.log(resp);
        alert('error');
      });
  };
};

const checkExistence = ( propS ) => {
  return (dispatch) => {
    const url = Endpoints.db + '/inventory/select';
    const selectObj = {};
    selectObj.columns = ['id'];
    selectObj.where = {
      'bar_code': propS.bar_code
    };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };

    return dispatch(requestAction(url, options));
  };
};

const updateStock = ( id ) => {
  return (dispatch, getState) => {
    const url = Endpoints.db + '/stock/insert';
    const propS = getState().inventory_data;
    const stockObj = {};
    const stockReqObj = {};
    let options;
    stockObj.quantity = parseInt(propS.quantity, 10);
    stockObj.inventory_id = id;
    stockObj.date_added = new Date().toISOString();
    stockObj.inventory_number = 'n/a';
    stockReqObj.objects = [stockObj];
    stockReqObj.returning = ['id'];
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(stockReqObj),
    };
    return dispatch(requestAction(url, options))
      .then( ( resp ) => {
        if ( resp.returning.length > 0 ) {
          return dispatch(routeActions.push('/inventory'));
        }
        alert('error while updating stock');
      })
      .catch( ( resp ) => {
        alert('error while updating stock' + resp);
      });
  };
};


const fetchInventoryData = () => {
  return (dispatch) => {
    const url = Endpoints.db + '/inventory/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'stocks',
        'columns': [
          'id', 'quantity'
        ]
      },
      {
        'name': 'orders',
        'columns': ['id', 'quantity']
      }
    ];
    selectObj.order_by = '-id';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };

    return dispatch(requestAction(url, options, INVENTORY_DATA_FETCHED, ERROR_HANDLING));
  };
};

const uploadCSV = (fileInput) => {
  return (dispatch) => {
    const url = 'http://api.dated78.hasura-app.io/upload_csv';

    const formData = new FormData();
    formData.append('file', fileInput, 'file');
    const options = {
      method: 'POST',
      credentials: globalCookiePolicy,
      body: formData,
    };

    return dispatch(requestAction(url, options))
      .then((r) => {
        console.log(r);
        alert('FileUploaded');
        return dispatch(fetchInventoryData());
      })
      .catch( (r) => {
        alert('Error while uploading');
        console.log('rCa');
        console.log(r);
      });
  };
};

const deleteInventoryData = (inventoryId) => {
  return (dispatch) => {
    const deleteObj = {};
    const url = Endpoints.db + '/inventory/delete';
    deleteObj.where = {
      'id': parseInt(inventoryId, 10)
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
        return dispatch(fetchInventoryData());
      })
      .catch( ( resp ) => {
        console.log(resp);
        alert('error');
      });
  };
};

/* */

/* Inventory Reducer */

const inventoryReducer = ( state = defaultInventoryState, action ) => {
  switch ( action.type ) {
    case INPUT_VALUE_CHANGED:
      /* Will send field type and the data */
      const currentInput = {};
      currentInput[ action.data.fieldType ] = action.data.value;
      return { ...state, ...currentInput };
    case INVENTORY_DATA_FETCHED:
      return { ...state, fetchedInventory: action.data };
    case ERROR_HANDLING:
      return { ...state, error: true};
    default:
      return state;
  }
};

export default inventoryReducer;

export {
  INPUT_VALUE_CHANGED,
  uploadInventoryData,
  fetchInventoryData,
  deleteInventoryData,
  uploadCSV,
  checkExistence,
  updateStock
};
