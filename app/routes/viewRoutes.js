const users = require('../entities/users/userViewRoutes');
const tasks = require('../entities/tasks/taskViewRoutes');

const initializeRoutes = (app) => {
	app.use('/user', users);
	app.use('/task', tasks);
	app.use('/', tasks);
}

module.exports = initializeRoutes;