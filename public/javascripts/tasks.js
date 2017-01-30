class TaskManager {
	constructor() {
		this.$$taskList = document.getElementById('task-list');
		this.taskService = new TaskService();
		this.domManipulator = new DOMManipulator();
		this.commands = [];

		this._init();
	}

	_bindListeners() {
		document.addEventListener('click', (event) => {
			this.commands.forEach((c) => {
				if (c.commandName === event.target.className) {
					c.callback(this, event);
				}
			});
		});
	}

	_init() {
		this.commands.push({
			commandName: 'add-task',
			callback: this._onAddClick
		});

		this._bindListeners();
		this._loadTasks();
	}

	_loadTasks() {
		this.taskService.loadTasks().then((tasks) => this._renderTasks(tasks));
	}

	_renderTasks(tasks) {
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
		this.commands.push({
			commandName: 'edit-task',
			callback: this._onEditClick
		});

		$actionsContainer.appendChild(this.domManipulator.createButton('Save', 'save-task hidden'));
		this.commands.push({
			commandName: 'save-task',
			callback: this._onSaveClick
		});

		$actionsContainer.appendChild(this.domManipulator.createButton('Delete', 'delete-task'));
		this.commands.push({
			commandName: 'delete-task',
			callback: this._onDeleteClick
		});
		return $actionsContainer;
	}

	_onAddClick(obj, event) {
		var $taskName = event.target.parentNode.querySelector('.task-name');
		var $taskDescription = event.target.parentNode.querySelector('.task-description');

		obj.taskService.createNewTask({
			name: $taskName.value,
			description: $taskDescription.value
		}).then((task) => {
			obj.$$taskList.appendChild(obj._renderTask(task));
			$taskName.value = '';
			$taskDescription.value = '';
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
		var taskName = $editableBlock.querySelector('.task-name').value;
		var taskDescription = $editableBlock.querySelector('.task-description').value;

		var $block = $row.querySelector('.readonly');
		var $taskIdReadonly = $block.querySelector('.task-id');
		var $taskNameReadonly = $block.querySelector('.task-name');
		var $taskDescriptionReadonly = $block.querySelector('.task-description');

		$taskNameReadonly.innerText = taskName;
		$taskDescriptionReadonly.innerText = taskDescription;

		obj.domManipulator.toggleElements($block, $editableBlock);
		obj.domManipulator.toggleElements($row.querySelector('.edit-task'), event.target);

		obj.taskService.saveTask({
			_id: $taskIdReadonly.innerText,
			name: taskName,
			description: taskDescription,
			isDone: isDone
		});
	}

	_onDeleteClick(obj, event) {
		var $row = obj.domManipulator.getClosest(event.target, '.grid-row');
		var taskIdReadonly = $row.querySelector('.task-id');
		obj.taskService.deleteTask(taskIdReadonly.innerText).then(function() {
			obj.$$taskList.removeChild($row);
		});
	}
}

var taskManger = new TaskManager();