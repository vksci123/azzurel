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
    // const styles = require('./InvoicePrint.scss');
    const { orderDetails } = this.props;

    const styleVar = require('./InvoicePrintCss');
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
              <div style={ styleVar.bill_header_values } key = { index } >
                <div style={ styleVar.width_7 }>
                  { index + 1 }
                </div>
                <div style={ styleVar.width_15 }>
                  { item.parent_product.bar_code }
                </div>
                <div style={ styleVar.width_15 }>
                  { item.name }
                </div>
                <div style={ styleVar.width_7 }>
                  { item.size }
                </div>
                <div style={ styleVar.width_7 }>
                  { item.quantity }
                </div>
                <div style={ styleVar.width_10 }>
                  { item.purchase_price }
                </div>
                <div style={ styleVar.width_7 }>
                  { item.discount }
                </div>
                <div style={ styleVar.width_7 }>
                  { orderDetails.vat_applied }
                </div>
                <div style={ styleVar.width_10 }>
                  { currVatValue }
                </div>
                <div style={ styleVar.width_10 }>
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
          <div style={ styleVar.invoice_wrapper }>
            <div style={ styleVar.invoice_print_wrapper } >
              <div style={ styleVar.header_wrapper }>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      Date: 03-07-2016
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text }>
                      Customer ID: CUST-{ isOrderDetail ? orderDetails.customer.id : ''}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      SHOP ID: AZ-{ isOrderDetail ? orderDetails.retailer.id : ''}
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      CUSTOMER: { isOrderDetail ? orderDetails.customer.name : ''}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      ADDRESS: { isOrderDetail ? orderDetails.retailer.shop_address : ''}
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      Loyality Program: N/A
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      TIN NO: { isOrderDetail ? orderDetails.retailer.tin_no : ''}
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      CONTACT NO: { isOrderDetail ? orderDetails.retailer.contact_no : ''}
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      RECEIPT NO: AZZU-{ isOrderDetail ? orderDetails.id : ''}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      SALE INCHARGE: { isOrderDetail ? orderDetails.retailer.pos[0].name : ''}
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                    </div>
                  </div>
                </div>
              </div>
              <div style={ styleVar.azzurel_text_wrapper }>
                <div style={ styleVar.azzurel_text }>
                  AZZUREL
                </div>
                <div style={ styleVar.azzurel_subheading }>
                  <div style={ styleVar.azzurel_subheading_text }>
                    RETAIL INVOICE
                  </div>
                </div>
              </div>
            </div>
            <div style={ styleVar.bill_wrapper }>
              <div style={ styleVar.bill_container }>
                <div style={ styleVar.bill }>
                  <div style={ styleVar.bill_header }>
                    <div style={ styleVar.width_7 }>
                      S.No
                    </div>
                    <div style={ styleVar.width_15 }>
                      BARCODE NO
                    </div>
                    <div style={ styleVar.width_15 }>
                      ITEM DESCRIPTION
                    </div>
                    <div style={ styleVar.width_7 }>
                      SIZE
                    </div>
                    <div style={ styleVar.width_7 }>
                      QTY
                    </div>
                    <div style={ styleVar.width_10 }>
                      MRP
                    </div>
                    <div style={ styleVar.width_7 }>
                      DISCOUNT %
                    </div>
                    <div style={ styleVar.width_7 }>
                      VAT TAX %
                    </div>
                    <div style={ styleVar.width_10 }>
                      VAT TAX AMOUNT
                    </div>
                    <div style={ styleVar.width_10 }>
                      NET AMOUNT
                    </div>
                  </div>
                  { orderDetailsHtml }
                  <div style={ styleVar.bill_header_bottom }>
                  </div>
                </div>
              </div>
            </div>
            <div style={ styleVar.bottom_summary }>
              <div style={ styleVar.header_wrapper }>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      Total Items: { (Object.keys(orderDetails).length > 0) ? orderDetails.order_items.length : 0 }
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      NET VALUE INCLUSIVE OF TAX: Rs. { totalValue + parseFloat(parseFloat(vatValue).toFixed(2))}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      NET VALUE PAYABLE: Rs. { totalValue + parseFloat(parseFloat(vatValue).toFixed(2)) }
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      TENDER TYPE: { orderDetails.payment_type }
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      TAX AMOUNT: Rs. { vatValue }
                    </div>
                  </div>
                </div>

                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text_footer}>
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
