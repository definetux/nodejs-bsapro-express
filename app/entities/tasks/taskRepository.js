const Repository = require('../../common/Repository');
const TaskModel = require('./taskSchema');

class TaskRepository extends Repository{

	constructor(){
		super();
		this.model = TaskModel;
	}

	changeState(id, state) {
		const query = this.model.update({
			_id: id
		}, {
			$set: {
				isDone: state
			}
		});
		return query.exec();
	}
}

module.exports = new TaskRepository();