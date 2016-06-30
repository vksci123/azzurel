import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class LeftNav extends Component {
  render() {
    const styles = require('./LeftNav.scss');

    const FontAwesome = require('react-fontawesome');

    const { activeElement } = this.props;

    return (
      <div className={ styles.left_nav_wrapper }>
        <div className={ styles.azzu_logo }>
          <div className={ styles.azzu_logo_text }>
            AZZUREL
          </div>
        </div>
        <div className={ styles.navigation }>
          <div className={ styles.navigation_text }>
            Navigation
          </div>
          <div className={ styles.navigation_items }>
            <div className={ styles.navigation_item }>
              <FontAwesome name="tachometer" className={ styles.fa } />
              <span className={ styles.nav_item }>
                Dashboard
              </span>
            </div>
            <Link to="/invoice">
              <div className={ styles.navigation_item + ' ' + ( activeElement === 'invoice' ? styles.navigation_item_active : '') }>
                <FontAwesome name="envelope" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  Billing
                </span>
              </div>
            </Link>
            <Link to="/inventory">
              <div className={ styles.navigation_item + ' ' + ( activeElement === 'inventory' ? styles.navigation_item_active : '') }>
                <FontAwesome name="calendar" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  Stocks
                </span>
              </div>
            </Link>
            <div className={ styles.navigation_item + ' ' + ( activeElement === 'reports' ? styles.navigation_item_active : '') }>
              <FontAwesome name="file" className={ styles.fa } />
              <span className={ styles.nav_item }>
                Reports
              </span>
            </div>
            <Link to="/customer">
              <div className={ styles.navigation_item + ' ' + ( activeElement === 'customer' ? styles.navigation_item_active : '') }>
                <FontAwesome name="users" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  Customers
                </span>
              </div>
            </Link>
            <div className={ styles.navigation_item }>
              <FontAwesome name="suitcase" className={ styles.fa } />
              <span className={ styles.nav_item }>
                Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LeftNav.propTypes = {
  activeElement: PropTypes.string.isRequired
};

export default LeftNav;
