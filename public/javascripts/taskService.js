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
			headers: this._getHeaders(),
			body: JSON.stringify(task)
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw 'Data was not saved.';
			}
		});
	}

	saveTask(task) {
		return fetch('/api/task/' + task._id, {
			method: 'PUT',
			headers: this._getHeaders(),
			body: JSON.stringify(task)
		}).then((response) => {
			if (!response.ok) {
				throw 'Data was not saved.';
			}
		});
	}

	deleteTask(id) {
		return fetch('/api/task/' + id, {
			method: 'DELETE',
			headers: this._getHeaders()
		});
	}

	changeState(id, state) {
		return fetch('/api/task/' + id + '/changeState', {
			method: 'PUT',
			headers: this._getHeaders(),
			body: JSON.stringify({ state: state })
		});
	}

	_getHeaders() {
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
	}
}