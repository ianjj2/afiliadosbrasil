module.exports = {
  host: process.env.REACT_APP_HOST || 'localhost',
  port: process.env.PORT || 3002,
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
}; 