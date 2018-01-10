const express = require('express');
const apiRouter = express.Router();

const employeesRouter = require('./employees');
const timesheetRouter = require('./timesheets');
const menusRouter = require('./menus');
const menuItemsRouter = require('./menuItems');

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/timesheets', timesheetRouter);
apiRouter.use('/menus', menusRouter);
apiRouter.use('/menuItems', menuItemsRouter);

module.exports = apiRouter;
