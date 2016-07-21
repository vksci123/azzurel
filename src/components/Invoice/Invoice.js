import React, { Component, PropTypes} from 'react';

import { Link } from 'react-router';

import { connect } from 'react-redux';

import { updateCustomerInfo,
  fetchProduct,
  DEL_ITEM,
  UPDATE_BAR_CODE,
  UPDATE_QUANTITY,
  createInvoice,
  PAYMENT_OPTION_CHANGE,
  RESET_INVOICE_DATA
} from './InvoiceAction';

class Invoice extends Component {
  componentDidMount() {
    this.props.dispatch(updateCustomerInfo());
  }
  componentWillUnmount() {
    this.props.dispatch({ type: RESET_INVOICE_DATA });
    // this.props.dispatch({ type: RESET_CONSUMER_DATA });
  }
  onPaymentOptionChange(e) {
    const value = e.target.selectedOptions[0].value;
    this.props.dispatch( { type: PAYMENT_OPTION_CHANGE, data: (value) });
  }
  barCodeRead(e) {
    const barCode = e.target.value;
    this.props.dispatch({ type: UPDATE_BAR_CODE, data: barCode });
    if ( this.props.name.length === 0 || this.props.email.length === 0 || this.props.contact_no === 0 ) {
      alert('Please select customer to proceed with the billing');
      return false;
    }
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
  createInvoice() {
    this.props.dispatch(createInvoice());
  }

  render() {
    const styles = require('./Invoice.scss');
    const currentDate = new Date();
    const { items, barCode, paymentType} = this.props;
    let totalPrice = 0;
    let vat = 0;

    const scannedItems = Object.keys(items).map( (item, index) => {
      const quantity = this.props.quantity[items[item].bar_code];
      totalPrice += ( quantity * items[item].price);

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
                { items[item].discount }
              </div>
              <div className={ styles.price_style }>
                <div className={ styles.indiv_price }>
                  { items[item].price * quantity }
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
                    Invoice
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
                    Invoice
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
                      <div className={ styles.select_consumer_button + ' ' + (!this.props.customer_available ? '' : 'hide') }>
                        <div className={ styles.select_button }>
                          <Link to="/customer/create">
                            Select Customer
                          </Link>
                        </div>
                      </div>
                      <div className={ styles.i_consumer_name + ' ' + (this.props.customer_available ? '' : 'hide') }>
                        <div>
                          <div className={ styles.name_wrapper }>
                            <div className={ styles.name }>
                              Customer Name :
                            </div>
                          </div>
                          <div className={ styles.value }>
                            { this.props.name }
                          </div>
                        </div>
                        <div>
                          <div className={ styles.name_wrapper }>
                            <div className={ styles.name }>
                              Customer Email Id :
                            </div>
                          </div>
                          <div className={ styles.value }>
                            { this.props.email }
                          </div>
                        </div>
                        <div>
                          <div className={ styles.name_wrapper }>
                            <div className={ styles.name }>
                              Phone :
                            </div>
                          </div>
                          <div className={ styles.value }>
                            { this.props.contact_no }
                          </div>
                        </div>
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
                      <div className={ styles.price_style }>
                        Price
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
                  <div className={ styles.select_box}>
                    <p>
                      Payment Mode
                    </p>
                    <p>
                      <select data-field-name="type_of_payment" onChange = { this.onPaymentOptionChange.bind(this) } selected={ paymentType }>
                        <option value="Cash"> Cash </option>
                        <option value="Card"> Card </option>
                      </select>
                    </p>
                  </div>
                  <div className={ styles.pay_button}>
                    <div className={ styles.pay_button_text } onClick={ this.createInvoice.bind(this) } >
                      Pay Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
  }
}

Invoice.propTypes = {
  dispatch: PropTypes.func.isRequired,
  customer_available: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  contact_no: PropTypes.number.isRequired,
  items: PropTypes.object.isRequired,
  barCode: PropTypes.string.isRequired,
  quantity: PropTypes.object.isRequired,
  paymentType: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.customer_data, ...state.invoice_data };
};

export default connect( mapStateToProps )(Invoice);
