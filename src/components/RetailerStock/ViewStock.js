import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { fetchInventoryData, RESET} from './RetailerInventoryAction';

class ViewStock extends Component {
  componentDidMount() {
    this.props.dispatch( fetchInventoryData() );
  }

  componentWillUnmount() {
    this.props.dispatch( { type: RESET });
  }

  render() {
    const styles = require('./Stock.scss');
    const { fetchedInventory } = this.props;
    console.log(fetchedInventory );

    let fetchedInventoryHtml = fetchedInventory.map( ( inventory, index ) => {
      console.log(inventory.stocks);
      const returnQuantity = ( stocks ) => {
        let qty = 0;
        stocks.forEach( ( stock ) => {
          qty += stock.quantity;
        });
        return qty;
      };

      const orderedQuantity = ( orders ) => {
        let qty = 0;
        orders.forEach( ( order ) => {
          qty += order.quantity;
        });
        return qty;
      };

      console.log(returnQuantity);
      console.log(orderedQuantity);

      const stockQuantity = ( inventory.qty ) ? inventory.qty : 0;

      // const availableQuantity = (inventory.stocks.length > 0) ? stockQuantity - orderedQuantity(inventory.orders) : 0;

      // const inventoryUrl = '/inventory/edit/' + inventory.id;
      return (
              <tr key={ index } data-inventory-id={ inventory.id }>
                <td>
                  { ( inventory.inventory ? inventory.inventory.bar_code : 'n/a' )}
                </td>
                <td>
                  { ( inventory.retailer ? inventory.retailer.shop_name : 'n/a' )}
                </td>
                <td>
                  { ( inventory.retailer ? inventory.retailer.shop_address : 'n/a' ) }
                </td>
                <td>
                  { ( inventory.inventory ? inventory.inventory.name : 'n/a') }
                </td>
                <td>
                  { stockQuantity }
                </td>
                <td>
                  0
                </td>
                <td>
                  { (inventory.inventory ) ? inventory.inventory.size : 'n/a' }
                </td>
                <td>
                  { (inventory.inventory) ? inventory.inventory.colour : 'n/a' }
                </td>
                <td>
                  Rs. { inventory.price_per_qty }
                </td>
                <td>
                  Rs. 0
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
                  <th> Code </th>
                  <th> Shop Name </th>
                  <th> Shop Address </th>
                  <th> Item Name </th>
                  <th> Quantity </th>
                  <th> Available Quantity </th>
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
      <div className={ styles.body_container }>
        <div className={ styles.body_buttons_wrapper }>
        </div>
        <div className={ styles.form_wrapper }>
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
  return { ...state.retailer_data };
};

export default connect( mapStateToProps )(ViewStock);
