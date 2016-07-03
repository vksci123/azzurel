import React, { Component, PropTypes} from 'react';

import { connect } from 'react-redux';

import {
  fetchOrder
} from './InvoicePrintAction';

class InvoicePrint extends Component {
  componentDidMount() {
    this.props.dispatch(fetchOrder(this.props.params.Id));
  }
  render() {
    const styles = require('./InvoicePrint.scss');
    const { orderDetails } = this.props;
    let vatValue = 0;
    let totalValue = 0;

    const renderHtml = () => {
      const items = orderDetails.order_items;
      return items.map( ( item, index ) => {
        const currentPrice = item.purchase_price * item.quantity;
        const currVatValue = parseFloat(parseFloat(((orderDetails.vat_applied) * currentPrice / 100)).toFixed(2));
        vatValue += currVatValue;
        totalValue += currentPrice;
        return (
              <div className={ styles.bill_header_values } key = { index } >
                <div className={ styles.width_7 }>
                  { index + 1 }
                </div>
                <div className={ styles.width_15 }>
                  { item.parent_product.bar_code }
                </div>
                <div className={ styles.width_15 }>
                  { item.name }
                </div>
                <div className={ styles.width_7 }>
                  { item.size }
                </div>
                <div className={ styles.width_7 }>
                  { item.quantity }
                </div>
                <div className={ styles.width_10 }>
                  { item.purchase_price }
                </div>
                <div className={ styles.width_7 }>
                  { item.discount }
                </div>
                <div className={ styles.width_7 }>
                  { orderDetails.vat_applied }
                </div>
                <div className={ styles.width_10 }>
                  { currVatValue }
                </div>
                <div className={ styles.width_10 }>
                  { currentPrice + currVatValue }
                </div>
              </div>
            );
      });
    };

    const renderDefault = () => {
      return (
            <div >
              Wait
            </div>
          );
    };

    const orderDetailsHtml = Object.keys(orderDetails).length > 0 ? renderHtml() : renderDefault();

    const isOrderDetail = Object.keys(orderDetails).length > 0 ? true : false;

    return (
          <div>
            <div className={ styles.invoice_print_wrapper } >
              <div className={ styles.header_wrapper }>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      Date: 03-07-2016
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      Customer ID: CUST-{ isOrderDetail ? orderDetails.customer.id : ''}
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      SHOP ID: AZ-00123
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      CUSTOMER NAME: { isOrderDetail ? orderDetails.customer.name : ''}
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      ADDRESS: C1 Janak Puri
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      Loyality Program: N/A
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      TIN NO: 1256225-w
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      CONTACT NO: 9999122221
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      RECEIPT NO: AZZU-{ isOrderDetail ? orderDetails.id : ''}
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      SALE INCHARGE: PANKAJ
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                    </div>
                  </div>
                </div>
              </div>
              <div className={ styles.azzurel_text_wrapper }>
                <div className={ styles.azzurel_text }>
                  AZZUREL
                </div>
                <div className={ styles.azzurel_subheading }>
                  <div className={ styles.azzurel_subheading_text }>
                    RETAIL INVOICE
                  </div>
                </div>
              </div>
            </div>
            <div className={ styles.bill_wrapper }>
              <div className={ styles.bill_container }>
                <div className={ styles.bill }>
                  <div className={ styles.bill_header }>
                    <div className={ styles.width_7 }>
                      S.No
                    </div>
                    <div className={ styles.width_15 }>
                      BARCODE NO
                    </div>
                    <div className={ styles.width_15 }>
                      ITEM DESCRIPTION
                    </div>
                    <div className={ styles.width_7 }>
                      SIZE
                    </div>
                    <div className={ styles.width_7 }>
                      QTY
                    </div>
                    <div className={ styles.width_10 }>
                      MRP
                    </div>
                    <div className={ styles.width_7 }>
                      DISCOUNT %
                    </div>
                    <div className={ styles.width_7 }>
                      VAT TAX %
                    </div>
                    <div className={ styles.width_10 }>
                      VAT TAX AMOUNT
                    </div>
                    <div className={ styles.width_10 }>
                      NET AMOUNT
                    </div>
                  </div>
                  { orderDetailsHtml }
                  <div className={ styles.bill_header_bottom }>
                  </div>
                </div>
              </div>
            </div>
            <div className={ styles.bottom_summary }>
              <div className={ styles.header_wrapper }>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      Total Items: { (Object.keys(orderDetails).length > 0) ? orderDetails.order_items.length : 0 }
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      NET VALUE INCLUSIVE OF TAX: Rs. { totalValue + parseFloat(parseFloat(vatValue).toFixed(2))}
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      NET VALUE PAYABLE: Rs. { totalValue + parseFloat(parseFloat(vatValue).toFixed(2)) }
                    </div>
                  </div>
                </div>
                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                      TENDER TYPE: { orderDetails.payment_type }
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text}>
                      TAX AMOUNT: Rs. { vatValue }
                    </div>
                  </div>
                </div>

                <div className={ styles.line_wrapper }>
                  <div className={ styles.left_content }>
                    <div className={ styles.left_content_text}>
                    </div>
                  </div>
                  <div className={ styles.right_content }>
                    <div className={ styles.right_content_text_footer}>
                      Authorized Signatory
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
  }
}

InvoicePrint.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orderDetails: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.invoice_print_data };
};

export default connect( mapStateToProps )(InvoicePrint);
