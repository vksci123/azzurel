import loginReducer from './Login/Action';
import inventoryReducer from './Inventory/InventoryAction';

import { combineReducers } from 'redux';

const reducer = combineReducers( {
  inventory_data: inventoryReducer,
  loginState: loginReducer
});

export default reducer;
