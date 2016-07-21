import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

import { fetchInvoiceData } from './InvoiceAction.js';

class InvoiceView extends Component {
  componentDidMount() {
    this.props.dispatch( fetchInvoiceData() );
  }

  render() {
    const styles = require('../Inventory/Stock.scss');
    const FontAwesome = require('react-fontawesome');
    const { fetchedInvoice } = this.props;
    let finalAmount = 0;

    let fetchedInvoiceHtml = fetchedInvoice.map( ( invoice, index ) => {
      const invUrl = '/generate_invoice/' + invoice.id;
      let totalAmount = 0;
      let totalVat = 0;
      let amount = 0;
      let vat = 0;
      invoice.order_items.forEach( ( item ) => {
        amount = 0;
        vat = 0;
        amount = (item.purchase_price * item.quantity);
        vat = parseFloat(parseFloat((amount * invoice.vat_applied) / 100).toFixed(2));
        totalAmount += amount;
        totalVat += vat;
      });

      finalAmount += (totalAmount + totalVat);
      return (
              <tr key={ index } data-invoice-id={ invoice.id }>
                <td data-invoice-id={ invoice.id }>
                  <Link to={ invUrl } >
                    <FontAwesome name="print" className={ styles.icon_class } data-invoice-id={ invoice.id } />
                  </Link>
                </td>
                <td>
                  INV-{ invoice.id}
                </td>
                <td>
                  { invoice.customer.name }
                </td>
                <td>
                  { totalAmount + totalVat }
                </td>
                <td>
                  0
                </td>
                <td>
                  Rs: { totalAmount + totalVat }
                </td>
                <td>
                  { invoice.payment_type }
                </td>
              </tr>
          );
    });

    fetchedInvoiceHtml = ( fetchedInvoiceHtml.length === 0) ? (
          <div >
            No Invoice Generated Yet
          </div>
        )
        : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th> Action </th>
                  <th> Invoice Number </th>
                  <th> Customer Name </th>
                  <th> Bill Amount </th>
                  <th> Discount </th>
                  <th> Paid </th>
                  <th> Mode of payment </th>
                </tr>
              </thead>
              <tbody>
                { fetchedInvoiceHtml }
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Rs. { finalAmount }</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          );

    return (
      <div>
        <div className={ styles.body_buttons_wrapper }>
          <div className={ styles.body_buttons }>
            {/*
            <input className={ styles.btn + " " + styles.yellow_btn } type="button" value="Upload" />
            <input className={ styles.btn + " " + styles.grey_btn } type="button" value="Price List" />
            */}
          </div>
        </div>
        <div className={ styles.form_wrapper }>
          <div className={ styles.form_sub_header }>
            Invoice List
          </div>
          <div className={ styles.table_body }>
            { fetchedInvoiceHtml }
          </div>
        </div>
      </div>
    );
  }
}

InvoiceView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetchedInvoice: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.invoice_data };
};

export default connect( mapStateToProps )(InvoiceView);
