const users = require('../entities/users/userAPIRoutes');
const tasks = require('../entities/tasks/taskAPIRoutes');
const Math = require('../common/mathService');

const math = new Math();

const initializeRoutes = (app) => {
	app.use('/api/user', users);
	app.use('/api/task', tasks);
	app.get('/api/math/fib/:num', (req, res, next) => {
		math.fib(req.params.num)
			.then((x) => res.send({
				result: x
			}));
	});
}

module.exports = initializeRoutes;