const router = require('koa-router')();
const task = require('../entities/tasks/taskViewRoutes');

const initializeRoutes = () => {
	router.use('/', task.routes(), task.allowedMethods());
	router.use('/task', task.routes(), task.allowedMethods());
	return router;
}

module.exports = initializeRoutes;