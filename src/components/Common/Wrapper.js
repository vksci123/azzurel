import React, { Component, PropTypes } from 'react';

import LeftNav from '../Inventory/LeftBar';
import RightSide from '../Inventory/RightSide';

class Wrapper extends Component {
  render() {
    const { children } = this.props;
    // const styles = require('./Inventory.scss');
    return (
      <div>
        <LeftNav { ...this.props }/>
        <RightSide { ...this.props } >
          { children }
        </RightSide>
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default Wrapper;
