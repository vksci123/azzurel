import loginReducer from './components/Login/Actions';
import inventoryReducer from './components/Inventory/InventoryAction';
import customerReducer from './components/Customer/CustomerAction';
import invoiceReducer from './components/Invoice/InvoiceAction';
import invoicePrintReducer from './components/InvoicePrint/InvoicePrintAction';

import leftBarReducer from './components/Inventory/LeftBarAction';

import { combineReducers } from 'redux';

const reducer = combineReducers( {
  loginState: loginReducer,
  inventory_data: inventoryReducer,
  customer_data: customerReducer,
  invoice_data: invoiceReducer,
  invoice_print_data: invoicePrintReducer,
  left_nav_data: leftBarReducer
});

export default reducer;
