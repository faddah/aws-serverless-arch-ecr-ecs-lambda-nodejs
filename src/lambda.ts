import serverless from 'serverless-http';
import app from './app';

// Configure serverless-http for Lambda Function URLs
// Lambda Function URLs automatically handle binary responses
const handler: any = serverless(app, {
  binary: true  // Enable binary mode for all responses
});

module.exports.handler = handler;
