import React, { Component, PropTypes } from 'react';

import Wrapper from '../Common/Wrapper';

class RetailerInventory extends Component {
  render() {
    const { children } = this.props;
    const styles = require('./RetailerInventory.scss');
    return (
        <Wrapper className={ styles.body_container } { ...this.props } activeElement = "retailer_stock" subHeader="Retailer Stocks" >
          { children }
        </Wrapper>
    );
  }
}

RetailerInventory.propTypes = {
  children: PropTypes.node.isRequired
};

export default RetailerInventory;
