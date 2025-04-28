const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:8081',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
      }
    })
  );
}; 