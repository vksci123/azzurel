import React, { Component } from 'react';

import Wrapper from '../Common/Wrapper';

class InvoiceWrapper extends Component {
  render() {
    return (
          <Wrapper { ...this.props } activeElement = "invoice" subHeader="Billing & Reports" />
        );
  }
}

export default InvoiceWrapper;
