import React, { Component } from 'react';

import Logout from '../Logout/Logout';

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
        <div className={ styles.logout_wrapper }>
          <div className={ styles.logout_button }>
            <Logout />
          </div>
        </div>
      </div>
    );
  }
}

export default TopHeader;
