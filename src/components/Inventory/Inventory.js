import React, { Component, PropTypes } from 'react';

import Wrapper from '../Common/Wrapper';

class Inventory extends Component {
  render() {
    const { children } = this.props;
    // const styles = require('./Inventory.scss');
    return (
        <Wrapper { ...this.props } activeElement = "inventory" subHeader="Stock Inventory" >
          { children }
        </Wrapper>
    );
  }
}

Inventory.propTypes = {
  children: PropTypes.node.isRequired
};

export default Inventory;
