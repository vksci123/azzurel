import { globalCookiePolicy } from '../../Endpoints';
/* Library to generate certain generic pieces of code like request headers */

const generateOptions = ( credentials ) => {
  const userRole = ( Object.keys(credentials).length > 0 ) ? credentials.hasura_roles.filter( ( r ) => { return r !== 'user'; } ) : '';
  if ( userRole.length === 0) {
    console.log('userRole not detected');
    return {};
  }
  const opt = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-role': userRole[0]},
    credentials: globalCookiePolicy
  };
  return opt;
};

export {
  generateOptions
};
