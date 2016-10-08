import loginReducer from './components/Login/Actions';
import inventoryReducer from './components/Inventory/InventoryAction';
import customerReducer from './components/Customer/CustomerAction';
import invoiceReducer from './components/Invoice/InvoiceAction';
import invoicePrintReducer from './components/InvoicePrint/InvoicePrintAction';
import transferPrintReducer from './components/TransferPrint/TransferPrintAction';

import leftBarReducer from './components/Inventory/LeftBarAction';
import transferReducer from './components/Transfer/TransferAction';
import retailerStockReducer from './components/RetailerStock/RetailerInventoryAction';

import { combineReducers } from 'redux';

const reducer = combineReducers( {
  loginState: loginReducer,
  inventory_data: inventoryReducer,
  customer_data: customerReducer,
  invoice_data: invoiceReducer,
  invoice_print_data: invoicePrintReducer,
  left_nav_data: leftBarReducer,
  transfer_data: transferReducer,
  transfer_print_data: transferPrintReducer,
  retailer_data: retailerStockReducer
});

export default reducer;
