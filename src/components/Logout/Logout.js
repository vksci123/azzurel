import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { logout } from './LogoutAction';

class Logout extends Component {
  logMeOut() {
    this.props.dispatch(logout());
  }
  render() {
    const styles = {
      'wrapper': {
        'width': '100%',
        'paddingTop': '10px'
      },
      'text': {
        'textAlign': 'center',
        'cursor': 'pointer'
      }
    };
    return (
          <div style={ styles.wrapper }>
            <div style={ styles.text } onClick={ this.logMeOut.bind(this) }>
              Logout
            </div>
          </div>
        );
  }
}

Logout.propTypes = {
  dispatch: PropTypes.func.isRequired
};


export default connect()(Logout);
