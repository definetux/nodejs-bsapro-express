const users = require('../entities/users/userAPIRoutes');
const tasks = require('../entities/tasks/taskAPIRoutes');

const initializeRoutes = (app) => {
	app.use('/api/user', users);
	app.use('/api/task', tasks);
}

module.exports = initializeRoutes;