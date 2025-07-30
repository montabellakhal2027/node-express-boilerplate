const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const statusRoute = require('./status.route');
const config = require('../../config/config');

const router = express.Router();

// All routes will be prefixed with /api/v1 when mounted
const defaultRoutes = [
  {
    path: '/auth',    // Will become /api/v1/auth
    route: authRoute,
  },
  {
    path: '/users',   // Will become /api/v1/users
    route: userRoute,
  },
  {
    path: '/status',  // Will become /api/v1/status
    route: statusRoute,
  }
];

const devRoutes = [
  {
    path: '/docs',    // Will become /api/v1/docs
    route: docsRoute,
  }
];

// Mount routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Mount development-only routes
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
