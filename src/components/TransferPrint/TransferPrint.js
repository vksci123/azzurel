import React, { Component, PropTypes} from 'react';

import { connect } from 'react-redux';

import {
  fetchTransfer
} from './TransferPrintAction';

class TransferPrint extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTransfer(this.props.params.Id));
  }
  render() {
    // const styles = require('./TransferPrint.scss');
    const { transferDetails } = this.props;
    console.log('tra');
    console.log(transferDetails);

    const styleVar = require('./TransferPrintCss');
    const vatValue = 0;
    let totalValue = 0;

    const renderHtml = () => {
      const items = [ ...transferDetails ];

      return items.map( ( item, index ) => {
        const currentPrice = item.price_per_qty * item.qty;
        // const currVatValue = parseFloat(parseFloat(((orderDetails.vat_applied) * currentPrice / 100)).toFixed(2));
        // vatValue += currVatValue;
        const currVatValue = 0;
        totalValue += currentPrice;
        return (
              <div style={ styleVar.bill_header_values } key = { index } >
                <div style={ styleVar.width_7 }>
                  { index + 1 }
                </div>
                <div style={ styleVar.width_15 }>
                  { item.inventory.bar_code }
                </div>
                <div style={ styleVar.width_15 }>
                  { item.inventory.name }
                </div>
                <div style={ styleVar.width_7 }>
                  { item.inventory.size }
                </div>
                <div style={ styleVar.width_7 }>
                  { item.qty }
                </div>
                <div style={ styleVar.width_10 }>
                  { item.price_per_qty }
                </div>
                <div style={ styleVar.width_7 }>
                  0
                </div>
                <div style={ styleVar.width_7 }> {/* Vat values */}
                  0
                </div>
                <div style={ styleVar.width_10 }>
                  0
                </div>
                {/* End of it */}
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

    const transferDetailsHtml = Object.keys(transferDetails).length > 0 ? renderHtml() : renderDefault();

    const isTransferDetail = transferDetails.length > 0 ? true : false;


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
                      Customer ID: CUST-{ isTransferDetail ? transferDetails[0].retailer.id : ''}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      SHOP ID: XXXXXX
                    </div>
                  </div>
                  <div style={ styleVar.right_content }>
                    <div style={ styleVar.right_content_text}>
                      CUSTOMER: { isTransferDetail ? transferDetails[0].retailer.shop_name : ''}
                    </div>
                  </div>
                </div>
                <div style={ styleVar.line_wrapper }>
                  <div style={ styleVar.left_content }>
                    <div style={ styleVar.left_content_text}>
                      ADDRESS: { isTransferDetail ? transferDetails[0].retailer.shop_address : ''}

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
                      TIN NO: { isTransferDetail ? transferDetails[0].retailer.tin_no : ''}
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
                      CONTACT NO: { isTransferDetail ? transferDetails[0].retailer.contact_no : 'N/A' }
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
                  { transferDetailsHtml }
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
                      Total Items: { (transferDetails.length > 0) ? transferDetails.length : 0 }
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

TransferPrint.propTypes = {
  dispatch: PropTypes.func.isRequired,
  transferDetails: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.transfer_print_data };
};

export default connect( mapStateToProps )(TransferPrint);
