import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

import { INPUT_VALUE_CHANGED, uploadInventoryData } from './InventoryAction.js';

class CreateStock extends Component {

  onChangeListener(e) {
    const dataObj = {};
    const dataFieldType = e.target.getAttribute('data-field-type');
    dataObj.fieldType = e.target.getAttribute('data-field-name');
    dataObj.value = e.target.tagName === 'SELECT' ? () => {
      let i = 0;
      let selectedOptions = '';
      while ( i < e.target.selectedOptions.length ) {
        selectedOptions = ( selectedOptions.length > 0) ? selectedOptions + ',' + e.target.selectedOptions[i].value : e.target.selectedOptions[i].value;
        i += 1;
      }
      return selectedOptions;
    }() : e.target.value;

    dataObj.value = ( dataFieldType === 'float') ? parseFloat(dataObj.value) : dataObj.value;

    this.props.dispatch( { type: INPUT_VALUE_CHANGED, data: dataObj });
  }
  saveInventory() {
    this.props.dispatch( uploadInventoryData(this.props) );
  }
  render() {
    const styles = require('./Stock.scss');
    return (
      <div >
        <div className={ styles.body_buttons_wrapper }>
          <div className={ styles.body_buttons }>
            <Link to="/inventory/create">
              <input className={ styles.btn + ' ' + styles.yellow_btn } type="button" value="Add Stock" />
            </Link>
            <Link to="/inventory">
              <input className={ styles.btn + ' ' + styles.grey_btn } type="button" value="View Stock" />
            </Link>
            {/*
            <input className={ styles.btn + " " + styles.yellow_btn } type="button" value="Upload" />
            <input className={ styles.btn + " " + styles.grey_btn } type="button" value="Price List" />
            */}
          </div>
        </div>
        <div className={ styles.form_wrapper }>
          <div className={ styles.form_header }>
            Add Stock
          </div>
          <div className={ styles.form_border_bottom_stock }>
          </div>
          <div className={ styles.form_sub_header }>
            New Item
          </div>
          <div className={ styles.form_border_bottom_item }>
          </div>

          <div className={ styles.form_info }>
            <form id="add_stock_form">
              <div className={ styles.form_element }>
                <span>
                  Item Name
                </span>
                <input placeholder="Item's Name" className={ styles.form_elem } type="text" data-field-type="text" data-field-name="name" onChange={ this.onChangeListener.bind(this) } />
              </div>
              <div className={ styles.inner_form }>
                <div className={ styles.form_element + ' ' + styles.width_50 + ' ' + styles.form_float_left }>
                  <span>
                    Size
                  </span>
                  <select id="size_dropdown" className={ styles.form_elem + ' ' + styles.width_60_input + ' ' + styles.select_multiple } data-field-name="size" multiple onChange={ this.onChangeListener.bind(this) } data-field-type="text" >
                    <option value="XS"> XS </option>
                    <option value="S"> S </option>
                    <option value="M"> M </option>
                    <option value="L"> L </option>
                    <option value="XL"> XL </option>
                    <option value="XXL"> XXL </option>
                  </select>
                </div>
                <div className={ styles.form_element + ' ' + styles.width_50 + ' ' + styles.form_float_right } >
                  <span>
                    Colour
                  </span>

                  <input placeholder="Colour Code" className={ styles.form_elem + ' ' + styles.width_60_input } type="text" data-field-name="colour" onChange={ this.onChangeListener.bind(this) } data-field-type="text" />
                </div>
              </div>
              <div className={ styles.inner_form }>
                <div className={ styles.form_element + ' ' + styles.width_50 + ' ' + styles.form_float_left }>
                  <span>
                    Price
                  </span>

                  <input placeholder="Price" className={ styles.form_elem + ' ' + styles.width_60_input } type="text" data-field-name="price" onChange={ this.onChangeListener.bind(this) } data-field-type="float" />
                </div>
                <div className={ styles.form_element + ' ' + styles.width_50 + ' ' + styles.form_float_right }>
                  <span>
                    Discount
                  </span>

                  <input placeholder="Discount" className={ styles.form_elem + ' ' + styles.width_60_input } type="text" data-field-name="discount" onChange={ this.onChangeListener.bind(this) } data-field-type="float" />
                </div>
              </div>
              <div className={ styles.form_element }>
                <span>
                  Nick Name
                </span>
                {/*
                <select id="title_dropdown" className={ styles.form_elem } onChangeListener={this.onChangeListener.bind(this) }>
                  <option value="XL"> XL </option>
                </select>
                */}
                <input placeholder="NickName" className={ styles.form_elem + ' ' + styles.width_60_input } type="text" data-field-name="nickname" onChange={ this.onChangeListener.bind(this) } data-field-type="text"/>
              </div>
              <div className={ styles.form_element }>
                <span>
                  Quantity
                </span>
                {/*
                <select id="title_dropdown" className={ styles.form_elem } onChangeListener={this.onChangeListener.bind(this) }>
                  <option value="XL"> XL </option>
                </select>
                */}
                <input placeholder="Quantity" className={ styles.form_elem + ' ' + styles.width_60_input } type="text" data-field-name="quantity" onChange={ this.onChangeListener.bind(this) } data-field-type="float"/>
              </div>
              <div className={ styles.form_element }>
                <span>
                  Bar Code
                </span>
                <input placeholder="Bar Code Number" className={ styles.form_elem } type="text" onChange={ this.onChangeListener.bind(this) } data-field-name="bar_code" data-field-type="text" />
              </div>
              <div className={ styles.form_element }>
                <input className={ styles.btn + ' ' + styles.blue_btn } type="button" value="Save" onClick= { this.saveInventory.bind(this) } />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateStock.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.inventory_data };
};

export default connect( mapStateToProps )(CreateStock);
