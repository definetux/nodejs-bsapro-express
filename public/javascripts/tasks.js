class TaskManager {
	constructor() {
		this.$$taskList = document.getElementById('task-list');
		this.taskService = new TaskService();
		this.domManipulator = new DOMManipulator();
		this.commands = [];

		this._init();
	}

	_bindListeners() {
		this.commands.push({
			commandName: 'task-is-done',
			callback: this._onTaskStateChange
		});
		this.commands.push({
			commandName: 'add-task',
			callback: this._onAddClick
		});
		this.commands.push({
			commandName: 'edit-task',
			callback: this._onEditClick
		});
		this.commands.push({
			commandName: 'save-task',
			callback: this._onSaveClick
		});
		this.commands.push({
			commandName: 'delete-task',
			callback: this._onDeleteClick
		});
		this.commands.push({
			commandName: 'show-todo',
			callback: this._onShowTodoClick
		});
		this.commands.push({
			commandName: 'show-all',
			callback: this._onShowAllClick
		});

		document.addEventListener('click', (event) => {
			this.commands.forEach((c) => {
				if (event.target.className.indexOf(c.commandName) !== -1) {
					c.callback(this, event);
				}
			});
		});
	}

	_init() {
		this.showAll = false;
		this._bindListeners();
		this._loadTasks();
		this.socket = io('http://localhost:2222');
		this.socket.on('task_updated', (data) => {
			this._clearTasks(this.$$taskList);
			this._loadTasks(this.showAll);
		});
	}

	_loadTasks(all = true) {
		this.taskService.loadTasks().then((tasks) => this._renderTasks(tasks, all));
	}

	_renderTasks(tasks, all) {
		if (!all) {
			tasks = tasks.filter((task) => !task.isDone);
		}
		tasks.forEach((task) => this.$$taskList.appendChild(this._renderTask(task)));
	}

	_renderTask(task) {
		var $taskContainer = this.domManipulator.createBlock('grid-row');

		var $isDone = this.domManipulator.createCheckbox(task.isDone, 'grid-cell task-is-done');


		$taskContainer.appendChild($isDone);
		$taskContainer.appendChild(this._createEditableRow(task));		
		$taskContainer.appendChild(this._createRow(task));
		$taskContainer.appendChild(this._createActions());

		return $taskContainer;
	}

	_createEditableRow(task) {
		var $editableBlock = this.domManipulator.createBlock('editable hidden');
		$editableBlock.appendChild(this.domManipulator.createInput(task.name, 'grid-cell task-name'));
		$editableBlock.appendChild(this.domManipulator.createInput(task.description, 'grid-cell task-description'));
		return $editableBlock;
	}

	_createRow(task) {
		var $block = this.domManipulator.createBlock('readonly');
		$block.appendChild(this.domManipulator.createText(task._id, 'grid-cell task-id hidden'));
		$block.appendChild(this.domManipulator.createText(task.name, 'grid-cell task-name'));
		$block.appendChild(this.domManipulator.createText(task.description, 'grid-cell task-description'));
		return $block;
	}

	_createActions() {
		var $actionsContainer = this.domManipulator.createBlock('actions');

		$actionsContainer.appendChild(this.domManipulator.createButton('Edit', 'edit-task'));
		$actionsContainer.appendChild(this.domManipulator.createButton('Save', 'save-task hidden'));
		$actionsContainer.appendChild(this.domManipulator.createButton('Delete', 'delete-task'));
		
		return $actionsContainer;
	}

	_onAddClick(obj, event) {
		var $taskName = event.target.parentNode.querySelector('.task-name');
		var $taskDescription = event.target.parentNode.querySelector('.task-description');

		obj.taskService.createNewTask({
			name: $taskName.value,
			description: $taskDescription.value
		}).then((task) => {
			$taskName.value = '';
			$taskDescription.value = '';
		}).catch((err) => {
			$taskName.value = '';
			$taskDescription.value = '';

			alert(err);
		});
	}

	_onEditClick(obj, event) {
		var $row = obj.domManipulator.getClosest(event.target, '.grid-row');
		obj.domManipulator.toggleElements($row.querySelector('.editable'), $row.querySelector('.readonly'));
		obj.domManipulator.toggleElements($row.querySelector('.save-task'), event.target);
	}

	_onSaveClick(obj, event) {
		var $row = obj.domManipulator.getClosest(event.target, '.grid-row');
		var isDone = $row.querySelector('.task-is-done').checked;

		var $editableBlock = $row.querySelector('.editable');
		var $editableTaskName = $editableBlock.querySelector('.task-name');
		var $editableTaskDescription = $editableBlock.querySelector('.task-description');

		var $block = $row.querySelector('.readonly');
		var $taskIdReadonly = $block.querySelector('.task-id');
		var $taskNameReadonly = $block.querySelector('.task-name');
		var $taskDescriptionReadonly = $block.querySelector('.task-description');

		obj.taskService.saveTask({
			_id: $taskIdReadonly.innerText,
			name: $editableTaskName.value,
			description: $editableTaskDescription.value,
			isDone: isDone
		}).then(() => {
			$taskNameReadonly.innerText = $editableTaskName.value;
			$taskDescriptionReadonly.innerText = $editableTaskDescription.value;

			obj.domManipulator.toggleElements($block, $editableBlock);
			obj.domManipulator.toggleElements($row.querySelector('.edit-task'), event.target);
		}).catch((err) => {
			$editableTaskName.value = $taskNameReadonly.innerText;
			$editableTaskDescription.value = $taskDescriptionReadonly.innerText;

			alert(err);
		});
	}

	_onDeleteClick(obj, event) {
		var $row = obj.domManipulator.getClosest(event.target, '.grid-row');
		var taskIdReadonly = $row.querySelector('.task-id');
		obj.taskService.deleteTask(taskIdReadonly.innerText).then(function() {
		});
	}

	_onTaskStateChange(obj, event) {
		var $row = obj.domManipulator.getClosest(event.target, '.grid-row');
		var taskIdReadonly = $row.querySelector('.task-id');
		var state = $row.querySelector('.task-is-done').checked;
		obj.taskService.changeState(taskIdReadonly.innerText, state).then(function() {
		});
	}

	_onShowAllClick(obj, event) {
		obj.showAll = true;
		obj._clearTasks(obj.$$taskList);
		obj._loadTasks(obj.showAll);
	}

	_onShowTodoClick(obj, event) {
		obj.showAll = false;
		obj._clearTasks(obj.$$taskList);
		obj._loadTasks(obj.showAll);
	}

	_clearTasks(container) {
		while (container.firstChild) {
    		container.removeChild(container.firstChild);
		}
	}
}

var taskManger = new TaskManager();