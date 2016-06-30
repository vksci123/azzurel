import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

import { fetchCustomerData, deleteCustomerData } from './CustomerAction.js';

class CustomerView extends Component {
  componentDidMount() {
    this.props.dispatch( fetchCustomerData() );
  }

  deleteHandler(e) {
    const deleteId = e.target.getAttribute('data-customer-id');
    console.log(deleteId);
    this.props.dispatch( deleteCustomerData(deleteId) );
  }
  render() {
    const styles = require('../Inventory/Stock.scss');
    const FontAwesome = require('react-fontawesome');
    const { fetchedCustomer } = this.props;
    console.log(fetchedCustomer );

    let fetchedCustomerHtml = fetchedCustomer.map( ( customer, index ) => {
      return (
              <tr key={ index } data-customer-id={ customer.id }>
                <td data-customer-id={ customer.id }>
                  <FontAwesome name="times" className={ styles.icon_class } data-customer-id={ customer.id } onClick= { this.deleteHandler.bind(this) } />
                </td>
                <td>
                  { customer.name}
                </td>
                <td>
                  { customer.email}
                </td>
                <td>
                  { customer.contact_no }
                </td>
                <td>
                  { customer.address }
                </td>
              </tr>
          );
    });

    fetchedCustomerHtml = ( fetchedCustomerHtml.length === 0) ? (
          <div >
            No Customers Registered Yet
          </div>
        )
        : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th> Action </th>
                  <th> Name </th>
                  <th> Email </th>
                  <th> Contact Number </th>
                  <th> Address </th>
                </tr>
              </thead>
              <tbody>
                { fetchedCustomerHtml }
              </tbody>
            </table>
          );

    return (
      <div>
        <div className={ styles.body_buttons_wrapper }>
          <div className={ styles.body_buttons }>
            <Link to="/customer/create">
              <input className={ styles.btn + ' ' + styles.yellow_btn } type="button" value="Add Customer" />
            </Link>
            <Link to="/customer">
              <input className={ styles.btn + ' ' + styles.grey_btn } type="button" value="View Customers" />
            </Link>
            {/*
            <input className={ styles.btn + " " + styles.yellow_btn } type="button" value="Upload" />
            <input className={ styles.btn + " " + styles.grey_btn } type="button" value="Price List" />
            */}
          </div>
        </div>
        <div className={ styles.form_wrapper }>
          <div className={ styles.form_sub_header }>
            Customers List
          </div>
          <div className={ styles.table_body }>
            { fetchedCustomerHtml }
          </div>
        </div>
      </div>
    );
  }
}

CustomerView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetchedCustomer: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.customer_data };
};

export default connect( mapStateToProps )(CustomerView);
