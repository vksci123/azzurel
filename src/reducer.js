import loginReducer from './components/Login/Actions';
import inventoryReducer from './components/Inventory/InventoryAction';
import customerReducer from './components/Customer/CustomerAction';
import invoiceReducer from './components/Invoice/InvoiceAction';

import { combineReducers } from 'redux';

const reducer = combineReducers( {
  loginState: loginReducer,
  inventory_data: inventoryReducer,
  customer_data: customerReducer,
  invoice_data: invoiceReducer
});

export default reducer;