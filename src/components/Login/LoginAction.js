/* Actions, Action creators for Login Component */

/* Actions */
const INPUT_VALUE_CHANGED = '@login/INPUT_VALUE_CHANGED';
/* */

/* Initial State */

const initialState = {};
initialState.username = '';
initialState.password = '';

/* */

/* */
/*
const loadCredentials = () => {
  return (dispatch) => {
    const p1 = new Promise((resolve, reject) => {
      fetch(Endpoints.getCredentials, {credentials: globalCookiePolicy}).then(
        (response) => {
          if (response.ok) {
            response.json().then(
              (creds) => {
                dispatch(requestSuccess(creds));
                resolve();
              },
              () => { reject(); }
            );
          } else {
            reject();
          }
        },
        () => { reject(); }
      );
    });
    return p1;
  };
};
*/

/* */

/* Login Reducer */
const loginReducer = (state = initialState, action) => {
  console.log('action');
  console.log(action);
  switch ( action.type ) {
    case INPUT_VALUE_CHANGED:
      return { ...state, 'username': action.data };
    default:
      return { ...state };
  }
};

export default loginReducer;

export {
  INPUT_VALUE_CHANGED
};
