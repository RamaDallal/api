/*eslint-disable */
const environment = {
  development: {},
  production: {}
}[process.env.NODE_ENV || 'development'];


module.exports = Object.assign({
  db: 'mongodb://noursammour:passnord@ds141118.mlab.com:41118/pazar'
}, environment);
/*eslint-enable */
