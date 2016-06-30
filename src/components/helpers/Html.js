import React, { Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';

class Html extends Component {
  const { assets, component } = this.props;
  const content = component ? ReactDOM.renderToString(component) : '';
  render() {
    return (
          <html lang="en-us">
            <head>
              <link href="https://fonts.googleapis.com/css?family=Lato:300,400" rel="stylesheet" />
              <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous" />
            </head>
            <body>
              <div class="root"  id="root" dangerouslySetInnerHTML={{__html: content}}>
              </div>
              <script src={ assets.javascript.main } charSet="UTF-8"/>
              </script>
            </body>
          </html>
        );
  }
}
Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node
};
