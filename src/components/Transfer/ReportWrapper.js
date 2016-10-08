import React, { Component } from 'react';

import Wrapper from '../Common/Wrapper';

class ReportWrapper extends Component {
  render() {
    return (
          <Wrapper { ...this.props } activeElement = "reports" subHeader="Billing & Reports" />
        );
  }
}

export default ReportWrapper;
