process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['JWT_SECRET'] = 'test-secret-must-be-at-least-32-chars-long!!';
process.env['JWT_EXPIRES_IN'] = '7d';
process.env['CORS_ORIGIN'] = 'http://localhost:5173';
