const taskRepository = require('./taskRepository');
const FormatError = require('../../common/FormatError');

class TaskService {

	getAllTasks(){
		return taskRepository.findAll();
	}

	getTaskById(id){
		return taskRepository.findById(id);
	}

	editTask(id, task){
		return this._validateTask(task).then((task) => taskRepository.update({_id: id}, task));
	}

	deleteTask(id){
		return taskRepository.delete({_id: id});
	}

	addTask(task){
		return this._validateTask(task).then((task) => taskRepository.add(task));
	}
	changeState(id, state) {
		return taskRepository.changeState(id, state);
	}

	_validateTask(task) {
		if (task.name.indexOf('зрада') !== -1 || task.description.indexOf('зрада') !== -1) {
			return Promise.reject(new FormatError('Bad text'));
		} else {
			return Promise.resolve(task);
		}
	}
}

module.exports = new TaskService();