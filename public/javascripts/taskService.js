class TaskService {
	loadTasks() {
		return fetch('/api/task').then((response) => {
			if (response.ok) {
				return response.json();
			}
		});
	}

	createNewTask(task) {
		return fetch('/api/task/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(task)
		}).then((response) => {
			if (response.ok) {
				return response.json();
			}
		});
	}

	saveTask(task) {
		return fetch('/api/task/' + task._id, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(task)
		});
	}

	deleteTask(id) {
		return fetch('/api/task/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
	}
}