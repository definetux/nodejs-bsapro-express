const taskRepository = require('./taskRepository');

class TaskService {

	getAllTasks(){
		return taskRepository.findAll();
	}

	getTaskById(id){
		return taskRepository.findById(id);
	}

	editTask(id, task){
		return taskRepository.update({_id: id}, task);
	}

	deleteTask(id){
		return taskRepository.delete({_id: id});
	}

	addTask(task){
		return taskRepository.add(task);
	}
}

module.exports = new TaskService();