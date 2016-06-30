import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

import { fetchInventoryData, deleteInventoryData, uploadCSV } from './InventoryAction';

class ViewStock extends Component {
  componentDidMount() {
    this.props.dispatch( fetchInventoryData() );
  }

  deleteHandler(e) {
    const deleteId = e.target.getAttribute('data-inventory-id');
    console.log(deleteId);
    this.props.dispatch( deleteInventoryData(deleteId) );
  }
  uploadFile() {
    const fileInput = document.querySelectorAll('input[type=file]')[0];
    this.props.dispatch( uploadCSV(fileInput.files[0]));
  }
  render() {
    const styles = require('./Stock.scss');
    const FontAwesome = require('react-fontawesome');
    const { fetchedInventory } = this.props;
    console.log(fetchedInventory );

    let fetchedInventoryHtml = fetchedInventory.map( ( inventory, index ) => {
      return (
              <tr key={ index } data-inventory-id={ inventory.id }>
                <td data-inventory-id={ inventory.id }>
                  <FontAwesome name="pencil-square-o" className={ styles.icon_class } data-inventory-id={ inventory.id } />
                  <FontAwesome name="times" className={ styles.icon_class } data-inventory-id={ inventory.id } onClick= { this.deleteHandler.bind(this) } />
                </td>
                <td>
                  { inventory.bar_code}
                </td>
                <td>
                  { inventory.name }
                </td>
                <td>
                  { inventory.quantity ? inventory.quantity : 'N/A' }
                </td>
                <td>
                  { inventory.size }
                </td>
                <td>
                  { inventory.colour }
                </td>
                <td>
                  Rs. { inventory.price }
                </td>
                <td>
                  Rs. { inventory.discount }
                </td>
              </tr>
          );
    });

    fetchedInventoryHtml = ( fetchedInventoryHtml.length === 0) ? (
          <div >
            No Items Uploaded Yet
          </div>
        )
        : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th> Action </th>
                  <th> Code </th>
                  <th> Item Name </th>
                  <th> Quantity </th>
                  <th> Sizes </th>
                  <th> Colour </th>
                  <th> Price </th>
                  <th> Discount </th>
                </tr>
              </thead>
              <tbody>
                { fetchedInventoryHtml }
              </tbody>
            </table>
          );

    return (
      <div>
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
          <div className={ styles.upload_header }>
            <div className={ styles.upload_header_tag }>
              Upload
            </div>
            <div className={ styles.upload_container }>
              <div className={ styles.fileInput }>
                File Input
              </div>
              <div className={ styles.fileInputWrapper }>
                <input type="file" />
              </div>
              <input type="button" className={ styles.btn + ' ' + styles.yellow_btn } value="Upload" onClick={ this.uploadFile.bind(this) } />
            </div>
          </div>
          <div className={ styles.form_sub_header }>
            Available Items
          </div>
          <div className={ styles.table_body }>
            { fetchedInventoryHtml }
          </div>
        </div>
      </div>
    );
  }
}

ViewStock.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetchedInventory: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.inventory_data };
};

export default connect( mapStateToProps )(ViewStock);
