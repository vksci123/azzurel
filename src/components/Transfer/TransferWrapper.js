import React, { Component } from 'react';

import Wrapper from '../Common/Wrapper';

class TransferWrapper extends Component {
  render() {
    return (
          <Wrapper { ...this.props } activeElement = "transfer" subHeader="Transfer" />
        );
  }
}

export default TransferWrapper;
