import React, { Component } from 'react';

class NotFound extends Component {
  render() {
    const styles = require('./NotFound.scss');
    return (
          <div className={ styles.wrapper }>
            <div className={ styles.not_found_wrapper }>
              <div className={ styles.not_found_text }>
                Sorry Page Not Found!
              </div>
            </div>
          </div>
        );
  }
}

export default NotFound;
