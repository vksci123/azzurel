/* Action file for Inventory */

import { defaultRetailerInventory } from '../Common/DefaultState';

import Endpoints, { globalCookiePolicy } from '../../Endpoints';

import requestAction from '../Common/requestAction';

/* Action constants */

const INVENTORY_DATA_FETCHED = '@retailerstock/INVENTORY_DATA_FETCHED';
const ERROR_HANDLING = '@retailerstock/ERROR_HANDLING';
const RESET = '@retailerstock/RESET';

/* Action creators */

const fetchInventoryData = () => {
  return (dispatch) => {
    const url = Endpoints.db + '/retail_product/select';
    const selectObj = {};
    selectObj.columns = [
      '*',
      {
        'name': 'inventory',
        'columns': [
          '*'
        ]
      },
      {
        'name': 'retailer',
        'columns': ['*']
      }
    ];
    selectObj.order_by = '-id';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-role': 'admin'},
      credentials: globalCookiePolicy,
      body: JSON.stringify(selectObj),
    };

    return dispatch(requestAction(url, options, INVENTORY_DATA_FETCHED, ERROR_HANDLING));
  };
};

/* */

/* Inventory Reducer */

const retailerInventoryReducer = ( state = defaultRetailerInventory, action ) => {
  switch ( action.type ) {
    case INVENTORY_DATA_FETCHED:
      return { ...state, fetchedInventory: action.data };
    case ERROR_HANDLING:
      return { ...state, error: true};
    case RESET:
      return { ...defaultRetailerInventory };
    default:
      return state;
  }
};

export default retailerInventoryReducer;

export {
  fetchInventoryData,
  RESET
};
