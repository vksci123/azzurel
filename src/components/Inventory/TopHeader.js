import React, { Component } from 'react';

class TopHeader extends Component {
  render() {
    const styles = require('./TopHeader.scss');

    const FontAwesome = require('react-fontawesome');
    return (
      <div className={ styles.top_header }>
        <div className={ styles.nav_drawer }>
          <div className={ styles.nav_inner_div }>
            <FontAwesome name="outdent" />
          </div>
        </div>
      </div>
    );
  }
}

export default TopHeader;
