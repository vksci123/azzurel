import React, { Component, PropTypes} from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

import { routeActions } from 'redux-simple-router';

import { INPUT_VALUE_CHANGED,
  searchCustomer,
  RESET_SEARCH,
  loadCustomerInformation,
  insertCustomer
} from './CustomerAction';

class Customer extends Component {
  onChangeListener(e) {
    const dataObj = {};
    // const dataFieldType = e.target.getAttribute('data-field-type');
    dataObj.fieldType = e.target.getAttribute('data-field-name');

    // dataObj.value = ( dataFieldType === 'int') ? parseI(dataObj.value) : e.target.value;
    dataObj.value = e.target.value;

    this.props.dispatch( { type: INPUT_VALUE_CHANGED, data: dataObj });
  }
  saveInventory() {
    console.log('bello');
  }
  autoComplete(e) {
    const input = e.target.value;
    if ( input.length > 0) {
      this.props.dispatch(searchCustomer(input));
    } else {
      this.props.dispatch({ type: RESET_SEARCH });
    }
  }

  saveConsumer() {
    if ( !this.props.customerFound ) {
      alert('consumer not found inserting');
      this.props.dispatch( insertCustomer() );
      return false;
    }
    this.props.dispatch(routeActions.push('/invoice'));
  }

  loadCustomerInformation(e) {
    let element = e.target;

    element = ( element.className.indexOf('information') === -1 ) ? element.parentElement : element;
    this.props.dispatch( loadCustomerInformation(parseInt(element.getAttribute('data-customer-id'), 10)));
  }

  render() {
    const styles = require('./Customer.scss');
    const { search, recommendations, name, email, address } = this.props;
    const contact = this.props.contact_no;

    let recommendationsHtml = '';

    recommendationsHtml = recommendations.map( (reco, index) => {
      return (
            <div key={ index } data-customer-id={ reco.id } className={ (index % 2 ) ? styles.information_even : styles.information_odd } onClick={ this.loadCustomerInformation.bind(this) }>
              <div className={ styles.name_data }>
                { reco.name }
              </div>
              <div className={ styles.email_data }>
                { reco.email }
              </div>
            </div>
          );
    });
    if ( recommendationsHtml.length === 0 && search.length > 0) {
      recommendationsHtml = (
          <div className={ styles.information_odd } >
            Sorry customer not found. Please add below to proceed
          </div>
        );
    }
    return (
          <div className={ styles.form_wrapper }>
            <div className={ styles.form_info }>
              <div className={ styles.form_header }>
                Customer Details
              </div>
              <div className={ styles.form_border_bottom }>
              </div>

              <form id="add_consumer_form" className={ styles.add_consumer_form }>
                <div className={ styles.form_element }>
                  <span>
                    Search
                  </span>
                  <input placeholder="Search by name, email, phone_no" className={ styles.form_elem } type="text" data-field-type="text" data-field-name="name" onChange={ this.autoComplete.bind(this) } value={ search }/>
                  <div className={ styles.auto_complete_wrapper }>
                    { recommendationsHtml }
                  </div>
                </div>
                <div className={ styles.form_element }>
                  <span>
                    Name
                  </span>
                  <input placeholder="Item's Name" className={ styles.form_elem } type="text" data-field-type="text" data-field-name="name" onChange={ this.onChangeListener.bind(this) } value={ name } />
                </div>
                <div className={ styles.form_element }>
                  <span>
                    Email
                  </span>
                  <input placeholder="Email" className={ styles.form_elem } type="text" data-field-type="text" data-field-name="email" onChange={ this.onChangeListener.bind(this) } value={ email }/>
                </div>
                <div className={ styles.form_element }>
                  <span>
                    Contact No.
                  </span>
                  <input placeholder="Contact Info" className={ styles.form_elem } type="number" data-field-type="int" data-field-name="contact_no" onChange={ this.onChangeListener.bind(this) } value={ contact }/>
                </div>
                <div className={ styles.form_element }>
                  <span>
                    Address
                  </span>
                  <input placeholder="Address" className={ styles.form_elem } type="text" data-field-type="text" data-field-name="address" onChange={ this.onChangeListener.bind(this) } value={ address }/>
                </div>
                <div className={ styles.float_bull_righ }>
                  <div className={ styles.form_element }>
                    <Link to="/invoice">
                      <input className={ styles.btn + ' ' + styles.white_btn} type="button" value="Cancel" />
                    </Link>
                  </div>
                  <div className={ styles.form_element }>
                    <input className={ styles.btn + ' ' + styles.blue_btn } type="button" value="Done" onClick={ this.saveConsumer.bind(this) } />
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
  }
}

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  recommendations: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  contact_no: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  customerFound: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.customer_data };
};

export default connect( mapStateToProps )(Customer);
