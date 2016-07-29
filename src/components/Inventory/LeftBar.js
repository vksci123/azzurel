import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux';

import {
  fetchModules
} from './LeftBarAction.js';

class LeftNav extends Component {

  componentWillMount() {
    const roles = this.props.credentials.hasura_roles;
    if ( roles ) {
      this.props.dispatch( fetchModules(roles[1]) );
    }
  }

  render() {
    const styles = require('./LeftNav.scss');

    const FontAwesome = require('react-fontawesome');

    const { activeElement, modules } = this.props;

    console.log( 'this' );
    console.log(this.props);

    const moduleHtml = modules.map( ( module, index ) => {
      return (
            <Link to={ module.url } key={ index }>
              <div className={ styles.navigation_item + ' ' + ( activeElement === module.display_name ? styles.navigation_item_active : '') }>
                <FontAwesome name="envelope" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  { module.module }
                </span>
              </div>
            </Link>
          );
    });

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
            { moduleHtml }
            {/*
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
            <Link to="/invoice/view">
              <div className={ styles.navigation_item + ' ' + ( activeElement === 'reports' ? styles.navigation_item_active : '') }>
                <FontAwesome name="file" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  Reports
                </span>
              </div>
            </Link>
            <Link to="/customer">
              <div className={ styles.navigation_item + ' ' + ( activeElement === 'customer' ? styles.navigation_item_active : '') }>
                <FontAwesome name="users" className={ styles.fa } />
                <span className={ styles.nav_item }>
                  Customers
                </span>
              </div>
            </Link>
            */}
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
  activeElement: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  credentials: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired
};

const mapStateToProps = ( state ) => {
  return { ...state.loginState, ...state.left_nav_data };
};

export default connect(mapStateToProps)(LeftNav);
