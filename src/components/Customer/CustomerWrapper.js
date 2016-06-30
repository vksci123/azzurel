import React, { Component } from 'react';

import Wrapper from '../Common/Wrapper';

class CustomerWrapper extends Component {
  render() {
    return (
          <Wrapper { ...this.props } activeElement="customer" subHeader="Customer Registration" />
        );
  }
}

export default CustomerWrapper;
