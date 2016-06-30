import React, { Component, PropTypes} from 'react';
// import { Link } from 'react-router';

// import CreateStock from './CreateStock';
// import ViewStock from './ViewStock';

class SubHeader extends Component {
  render() {
    const styles = require('./Stock.scss');
    const { children, subHeader } = this.props;
    console.log('inside stock');
    console.log(this.props);
    return (
      <div className={ styles.body_container }>
        <div className={ styles.body_header }>
          <div className={ styles.body_header_content }>
            { subHeader }
          </div>
        </div>

        { children }
        {/*
        <CreateStock />
        */}
        {/*
          <ViewStock />
        */}
      </div>
    );
  }
}

SubHeader.propTypes = {
  children: PropTypes.node.isRequired,
  subHeader: PropTypes.string.isRequired
};

export default SubHeader;
