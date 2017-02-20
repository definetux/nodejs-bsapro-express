const taskRepository = require('./taskRepository');
const FormatError = require('../../common/FormatError');
const SocketService = require('../../common/SocketService');

class TaskService {
	constructor() {
		this.socketService = SocketService;
	}

	getAllTasks(){
		return taskRepository.findAll();
	}

	getTaskById(id){
		return taskRepository.findById(id);
	}

	editTask(id, task){
		return this._validateTask(task)
			.then((task) => taskRepository.update({_id: id}, task))
			.then((response) => {
				this.socketService.broadcast(this.socketService.TASK_UPDATED_EVENT);
				return response;
			});
	}

	deleteTask(id){
		return taskRepository.delete({_id: id})
			.then((response) => {
				this.socketService.broadcast(this.socketService.TASK_UPDATED_EVENT);
				return response;
			});
	}

	addTask(task){
		return this._validateTask(task)
			.then((task) => taskRepository.add(task))
			.then((response) => {
				this.socketService.broadcast(this.socketService.TASK_UPDATED_EVENT);
				return response;
			});
	}
	changeState(id, state) {
		return taskRepository.changeState(id, state)
			.then((response) => {
				this.socketService.broadcast(this.socketService.TASK_UPDATED_EVENT);
				return response;
			});
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