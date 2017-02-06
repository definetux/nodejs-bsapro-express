const taskRepository = require('./taskRepository');
const FormatError = require('../../common/FormatError');
const SocketService = require('../../common/SocketService');

const TASK_UPDATED_EVENT = 'task_updated';

class TaskService {
	constructor() {
		this.socketService = SocketService
	}

	getAllTasks(){
		return taskRepository.findAll();
	}

	getTaskById(id){
		return taskRepository.findById(id);
	}

	async editTask(id, task){
		const t = await this._validateTask(task);
		const response = await taskRepository.update({_id: id}, t);
		this.socketService.send(TASK_UPDATED_EVENT);
		return response;
	}

	async deleteTask(id){
		const response = await taskRepository.delete({_id: id});
		this.socketService.send(TASK_UPDATED_EVENT);
		return response;
	}

	async addTask(task){
		const t = await this._validateTask(task);
		const response = await taskRepository.add(t);
		this.socketService.send(TASK_UPDATED_EVENT);
		return response;
	}
	async changeState(id, state) {
		const response = await taskRepository.changeState(id, state);
		this.socketService.send(TASK_UPDATED_EVENT);
		return response;
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