/*eslint-disable */
const environment = {
  development: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: 3030,
    frontendHost: process.env.APIHOST || 'localhost',
    frontendPort: 3000
  },
  production: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    apiHost: process.env.APIHOST || 'pazar-graphql.herokuapp.com',
    apiPort: '',
    frontendHost: process.env.APIHOST || 'pazar-graphql.herokuapp.com',
    backendHost: process.env.APIHOST || 'pazar-next.herokuapp.com',
    frontendPort: ''
  }
}[process.env.NODE_ENV || 'development'];
module.exports = Object.assign({
  db: 'mongodb://noursammour:passnord@ds141118.mlab.com:41118/pazar',
  nodeMailer: {
    apiKey: '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'
  },
  jwt: {
    secretKey: 'super_secret'
  },
  facebookAuth: {
    clientID: '246362195777238',
    clientSecret: 'f76c130fe5ebc025d0f059652da4811d',
    callbackURL: 'http://localhost:3030/auth/facebook/callback',
    profileFields: ['id', 'email', 'name']
  }
}, environment);
/*eslint-enable */


