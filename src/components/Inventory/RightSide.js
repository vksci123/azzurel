import React, { Component, PropTypes } from 'react';

import TopHeader from './TopHeader';
// import CreateStock from './CreateStock';
import SubHeader from './SubHeader';

class RightSide extends Component {
  render() {
    const styles = require('./RightSide.scss');
    const { children } = this.props;
    return (
      <div className={ styles.right_side_wrapper }>
        <TopHeader />
        <SubHeader { ...this.props } >
          { children }
        </SubHeader>
        {/*
        <Stock />
        */}
      </div>
    );
  }
}

RightSide.propTypes = {
  children: PropTypes.node.isRequired
};

export default RightSide;
