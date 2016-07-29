const base = 'dated78.hasura-app.io';
// const base = '';
const Endpoints = {
  login: 'https://auth.' + base + '/login',
  logout: 'https://auth.' + base + '/user/logout',
  db: 'https://data.' + base + '/api/1/table',
  getSchema: base + '/api/1/table',
  getConsumer: base + '/api/1/table/consumer/select',
  schemaChange: base + '/api/1/change',
  getCredentials: 'https://auth.' + base + '/user/account/info',
  baseUrl: base
};
const globalCookiePolicy = 'include';

export default Endpoints;
export {globalCookiePolicy};
