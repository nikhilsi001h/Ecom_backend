const rateLimit = require('express-rate-limit');

const limiters = {
  slow: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many requests, please try again later'
  }),
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many login attempts, please try again later'
  }),
  anon: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
  }),
  default: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
};

module.exports = (type = 'default') => {
  return limiters[type] || limiters.default;
};