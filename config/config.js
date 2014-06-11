var config = require('nconf');

config
  .file({ file: __dirname+'/config.json' })
  .env();

config.defaults({
  'dogecoind_password': '',
  'GATEWAY_URL': '',
  'GATEWAY_API_KEY': '',
  'TOTAL_RECEIVED': 0
});

module.exports = config;

