import serverless from 'serverless-http';
import app from './app';

// Configure serverless-http to handle binary content types
const handler: any = serverless(app, {
  binary: ['image/*', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
});

module.exports.handler = handler;
