import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { INPUT_VALUE_CHANGED, makeRequest } from './Actions';

class Login extends Component {
  onLogin(e) {
    e.preventDefault();
    this.props.dispatch(makeRequest(this.props));
  }
  inputValueChanged(e) {
    console.log('input value changed');
    console.log(e.target);
    const dataObj = {};
    dataObj.key = e.target.getAttribute('data-field-name');
    dataObj.value = e.target.value;
    this.props.dispatch( { type: INPUT_VALUE_CHANGED, data: dataObj });
  }
  render() {
    const styles = require('./Login.scss');
    const { ongoingRequest, lastError } = this.props;
    console.log('error' + lastError);
    return (
        <div className={ styles.container } >
          <div className={styles.header_container }>
            <h1>
              AZZUREL
            </h1>
          </div>
          <form className={ styles.main_form } onSubmit={ this.onLogin.bind(this) }>
            <div className={ styles.form_element }>
              <input type="text" data-field-name="username" placeholder="Username" className={ styles.padding_left } onChange={ this.inputValueChanged.bind(this) } />
              <div className={ styles.text_before } >
                <div className={ styles.text } >
                  USERNAME
                </div>
                <div className={ styles.border_right }>
                </div>
              </div>
            </div>
            <div className={ styles.form_element }>
              <input type="password" placeholder="Password" data-field-name="password" className={ styles.padding_left } onChange={ this.inputValueChanged.bind(this) } />
              <div className={ styles.text_before } >
                <div className={ styles.text } >
                  PASSWORD
                </div>
                <div className={ styles.border_right }>
                </div>
              </div>
            </div>
            <div className={ styles.form_element }>
              <input type="submit" value={ ongoingRequest ? 'LOGGING IN' : () => { return ( lastError.length > 0 ? lastError : 'LOGIN'); }() } onClick= { this.onLogin.bind(this) } />
            </div>
          </form>
          <div className={ styles.info_message }>
            <p>
              Please go to our homepage or go back to previous page
            </p>
          </div>
          <div className={ styles.info_message }>
            <p>
              <i className="fa fa-copyright" aria-hidden="true"></i>
              <span className={ styles.copyright }>
                2016 AZZUREL
              </span>
            </p>
          </div>
        </div>
      );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ongoingRequest: PropTypes.bool.isRequired,
  lastError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return { ...state.loginState};
};

export default connect( mapStateToProps )(Login);
