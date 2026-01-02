import serverless from 'serverless-http';
import app from './app';

const handler: any  = serverless(app);
module.exports.handler = handler;
