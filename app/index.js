const Koa = require('koa');
const app = new Koa();

const path = require('path');
const logger = require('koa-logger');
const views = require('koa-views');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');

const taskService = require('./entities/tasks/taskService');

const initializeViewRoutes = require('./routes/viewRoutes');
const initializeAPIRoutes = require('./routes/apiRoutes');

const initializeDB = require('./db/db');
initializeDB();

app.use(views(__dirname + '/../views', {
  extension: 'pug'
}));

app.use(bodyParser());
app.use(convert(logger()));
app.use(static(path.join(__dirname, '/../public')));
app.use(static(path.join(__dirname, '/../node_modules')));

const viewRoutes = initializeViewRoutes();
app.use(viewRoutes.routes(), viewRoutes.allowedMethods());

const apiRoutes = initializeAPIRoutes();
app.use(apiRoutes.routes(), apiRoutes.allowedMethods());

module.exports = app;