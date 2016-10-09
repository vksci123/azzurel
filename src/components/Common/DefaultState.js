const defaultState = {
  ongoingRequest: false,
  lastError: {},
  lastSuccess: [],
  credentials: null,
  secondaryData: null,
  count: 1
};

const defaultInventoryState = {
  name: '',
  size: [],
  colour: [],
  price: '',
  discount: '',
  bar_code: '',
  fetchedInventory: []
};

const defaultRetailerInventory = {
  fetchedInventory: []
};

const defaultCustomerState = {
  recommendations: [],
  search: '',
  name: '',
  email: '',
  contact_no: 0,
  address: '',
  customerFound: false,
  fetchedCustomer: []
};

const defaultInvoiceState = {
  customer_available: false,
  items: {},
  barCode: '',
  productFetched: false,
  quantity: {},
  paymentType: 'Cash',
  fetchedInvoice: [],
  retailerId: 0,
  retailerInfo: []
};

const defaultTransferState = {
  retailerData: [],
  items: {},
  price: {},
  discount: {},
  barCode: '',
  productFetched: false,
  quantity: {},
  paymentType: 'Cash',
  fetchedInvoice: [],
  selectedRetailerId: ''
};

const defaultInvoicePrintState = {
  orderDetails: {}
};

const defaultTransferPrintState = {
  transferDetails: []
};

const defaultLeftNavBarState = {
  modules: []
};

export {
  defaultState,
  defaultInventoryState,
  defaultRetailerInventory,
  defaultCustomerState,
  defaultInvoiceState,
  defaultInvoicePrintState,
  defaultLeftNavBarState,
  defaultTransferState,
  defaultTransferPrintState
};
