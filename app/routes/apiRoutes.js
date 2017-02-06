const router = require('koa-router')();
const task = require('../entities/tasks/taskAPIRoutes');

const initializeRoutes = () => {
	router.use('/api/task', task.routes(), task.allowedMethods());
	return router;
}

module.exports = initializeRoutes;