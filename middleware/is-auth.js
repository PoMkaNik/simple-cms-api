const jwt = require('jsonwebtoken');

module.exports = (req, _, next) => {
  // check auth header
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error; // will handle it in controller
  }
  // get token from 'Bearer [token-here]'
  const token = authHeader.split(' ')[1];
  // 
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err; // will handle it in controller
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error; // will handle it in controller
  }
  req.userId = decodedToken.userId;
  next();
};
