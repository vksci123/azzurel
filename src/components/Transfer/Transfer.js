import React, { Component, PropTypes} from 'react';

import { connect } from 'react-redux';

import {
  fetchProduct,
  DEL_ITEM,
  UPDATE_BAR_CODE,
  UPDATE_QUANTITY,
  createTransfer,
  PAYMENT_OPTION_CHANGE,
  RESET_INVOICE_DATA,
  fetchRetailerData,
  UPDATE_RETAILER,
  UPDATE_INPUT
} from './TransferAction';

class Transfer extends Component {
  componentDidMount() {
    this.props.dispatch(( fetchRetailerData() ));
  }
  componentWillUnmount() {
    this.props.dispatch({ type: RESET_INVOICE_DATA });
    // this.props.dispatch({ type: RESET_CONSUMER_DATA });
  }
  onPaymentOptionChange(e) {
    const value = e.target.selectedOptions[0].value;
    this.props.dispatch( { type: PAYMENT_OPTION_CHANGE, data: (value) });
  }
  onRetailerChange(e) {
    this.props.dispatch( { type: UPDATE_RETAILER, data: e.target.selectedOptions[0].value });
  }
  onInputChange(e) {
    this.props.dispatch( { type: UPDATE_INPUT, data: { 'key': e.target.getAttribute('data-field-name'), 'data': e.target.value, 'barCode': e.target.getAttribute('data-field-id') } });
  }
  barCodeRead(e) {
    const barCode = e.target.value;
    this.props.dispatch({ type: UPDATE_BAR_CODE, data: barCode });
    if ( barCode.length > 0) {
      this.props.dispatch(fetchProduct(barCode));
    }
  }
  quantityChanged(e) {
    const barCode = e.target.getAttribute('data-field-id');
    const productId = parseInt(e.target.getAttribute('data-field-item-id'), 10);
    const quantity = e.target.value;

    const processQuantity = () => {
      if ( !parseInt(quantity, 10) ) {
        alert('Please enter valid quantity ');
        this.props.dispatch({ type: UPDATE_QUANTITY, data: {
          barCode: barCode,
          quantity: 1
        }});
        return false;
      } else if ( parseInt(quantity, 10) > this.props.items[productId].available_quantity ) {
        alert('Sorry selected number of items of this product is not available');
        this.props.dispatch({ type: UPDATE_QUANTITY, data: {
          barCode: barCode,
          quantity: 1
        }});
        return false;
      }
      this.props.dispatch({ type: UPDATE_QUANTITY, data: {
        barCode: barCode,
        quantity: parseInt(quantity, 10)
      }});
    };
    const clearQuantity = () => {
      this.props.dispatch({ type: UPDATE_QUANTITY, data: {
        barCode: barCode,
        quantity: ''
      }});
    };

    // Initiator
    () => {
      return (quantity.length > 0) ? processQuantity( quantity ) : clearQuantity();
    }();
  }

  deleteItem(e) {
    console.log(e.target);
    const itemId = parseInt(e.target.getAttribute('data-product-id'), 10);
    this.props.dispatch({ type: DEL_ITEM, data: itemId });
  }
  createTransfer() {
    this.props.dispatch(createTransfer());
  }

  render() {
    const styles = require('./Transfer.scss');
    const currentDate = new Date();
    const {
      items
      , barCode
      , retailerData
      , price
    } = this.props;

    let totalPrice = 0;
    let vat = 0;

    const retailerSelect = retailerData.map( ( retailer, index ) => {
      return (
        <option key={ index } value={ retailer.id }>
          { retailer.shop_name }
        </option>
      );
    });

    const scannedItems = Object.keys(items).map( (item, index) => {
      const currPrice = (( items[item].bar_code in price ) ? price[items[item].bar_code ] : 0 );
      const quantity = this.props.quantity[items[item].bar_code];
      totalPrice += ( quantity * currPrice );

      if ( index === Object.keys(items).length - 1) {
        vat = parseFloat((totalPrice * 12.5) / 100).toFixed(2);
        totalPrice = parseFloat(totalPrice) + parseFloat(vat);
        totalPrice = totalPrice.toFixed(2);
      }
      return (
            <div key={ index } className={ styles.billing_header + ' ' + styles.row }>
              <div className={ styles.code_style }>
                { items[item].bar_code }
              </div>
              <div className={ styles.product_style }>
                { items[item].name }
              </div>
              <div className={ styles.size_style }>
                { items[item].size}
              </div>
              <div className={ styles.quantity_style }>
                <input type="text" data-field-id = { items[item].bar_code } data-field-name="quantity" data-field-type="int" onChange={ this.quantityChanged.bind(this) } value = { this.props.quantity[ items[item].bar_code ] } data-field-item-id = { items[item].id } />
              </div>
              <div className={ styles.discount_style }>
                <input type="text" data-field-id = { items[item].bar_code } value={ items[item].discount } onChange={ this.onInputChange.bind(this) } data-field-name="discount" data-field-type="float" data-field-item-id={ items[item].id }/>
              </div>
              <div className={ styles.discount_style }>
                <input type="text" data-field-id = { items[item].bar_code } value={ currPrice } onChange={ this.onInputChange.bind(this) } data-field-name="price" data-field-type="float" data-field-item-id={ items[item].id } />
              </div>
              <div className={ styles.price_style }>
                <div className={ styles.indiv_price }>
                  { currPrice * quantity }
                </div>
                <div className={ styles.cross_style }>
                  <div className={ styles.cross_wrapper }>
                    <div className={ styles.cross } data-product-id={ items[item].id } onClick = { this.deleteItem.bind(this) } >
                      x
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
    });

    return (
          <div className={ styles.form_wrapper }>
            <div className={ styles.form_info }>
              <div className={ styles.left_sub_nav }>
                <div className={ styles.left_new_button }>
                  <div className={ styles.new_button }>
                    New
                  </div>
                </div>
                <div className={ styles.tabs_invoice }>
                  <div className={ styles.invoice_button }>
                    Transfer
                  </div>
                </div>
                <div className={ styles.tabs_return }>
                  <div className={ styles.return_button }>
                    Return
                  </div>
                </div>
              </div>
              <div className={ styles.right_div }>
                <div className={ styles.invoice_header }>
                  <div className={ styles.invoice_header_text }>
                    Transfer
                  </div>
                </div>
                <div className={ styles.invoice_info }>
                  <div className={ styles.invoice_top_info }>
                    <div className={ styles.invoice_top_date_info }>
                      <div className={ styles.i_date_info } >
                        <div >
                          Date: { currentDate.toLocaleDateString() }
                        </div>
                        <div >
                          Time: { currentDate.toLocaleTimeString() }
                        </div>
                      </div>
                      <div className={ styles.incharge_info }>
                        <div>
                          Shop Incharge: Mr. Raghuveesh
                        </div>
                        <div>
                          TIN No.: 039859942
                        </div>
                      </div>
                    </div>
                    <div className={ styles.invoice_top_customer_info}>
                      <div className={ styles.retailer_wrapper } >
                        <select className="form-control" onChange={ this.onRetailerChange.bind(this) }>
                          <option value="0"> Select Retailer </option>
                          { retailerSelect }
                        </select>
                        {/*
                        <div className={ styles.select_button }>
                          <Link to="/customer/create">
                            Select Customer
                          </Link>
                        </div>
                        */}
                      </div>
                    </div>
                  </div>
                  <div className={ styles.billing_info }>
                    <div className={ styles.billing_header }>
                      <div className={ styles.code_style }>
                        Code
                      </div>
                      <div className={ styles.product_style }>
                        Item Name
                      </div>
                      <div className={ styles.size_style }>
                        Size
                      </div>
                      <div className={ styles.quantity_style }>
                        Quantity
                      </div>
                      <div className={ styles.discount_style }>
                        Discount
                      </div>
                      <div className={ styles.product_price_style }>
                        Price
                      </div>
                      <div className={ styles.price_style }>
                        Final Price
                      </div>
                    </div>
                    { scannedItems }
                    <div className={ styles.billing_header }>
                      <div className={ styles.code_style }>
                        <input type="text" onChange={ this.barCodeRead.bind(this) } value = { barCode } />
                      </div>
                      {/*
                      <div className={ styles.product_style }>
                      </div>
                      <div className={ styles.size_style }>
                      </div>
                      <div className={ styles.quantity_style }>
                      </div>
                      <div className={ styles.discount_style }>
                      </div>
                      <div className={ styles.price_style }>
                      </div>
                      */}
                    </div>
                    <div className={ styles.vat_value_container }>
                      <div className={ styles.vat_value_wrapper }>
                        <div className={ styles.vat_value_heading }>
                          Vat (12.5%)
                        </div>
                        <div className={ styles.vat_value }>
                          { vat }
                        </div>
                      </div>
                    </div>

                    <div className={ styles.total_value_container }>
                      <div className={ styles.total_value_wrapper }>
                        <div className={ styles.total_value_heading }>
                          Total
                        </div>
                        <div className={ styles.total_value }>
                          { totalPrice }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={ styles.actions }>
                <div className={ styles.buttons }>
                  <div className={ styles.pay_button}>
                    <div className={ styles.pay_button_text } onClick={ this.createTransfer.bind(this) } >
                      Transfer Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
  }
}

Transfer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  contact_no: PropTypes.number.isRequired,
  items: PropTypes.object.isRequired,
  barCode: PropTypes.string.isRequired,
  quantity: PropTypes.object.isRequired,
  price: PropTypes.object.isRequired,
  discount: PropTypes.object.isRequired,
  paymentType: PropTypes.string.isRequired,
  retailerData: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.customer_data, ...state.transfer_data };
};

export default connect( mapStateToProps )(Transfer);
