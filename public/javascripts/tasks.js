(function() {
	'use strict';

	var $$taskList = document.getElementById('task-list');
	var $$newTaskContainer = document.getElementById('new-task');

	bindListeners();
	loadTasks();

	function bindListeners() {
		var $addNewButton = $$newTaskContainer.querySelector('.save-task');
		$addNewButton.addEventListener('click', function(event) {
			var $taskName = event.target.parentNode.querySelector('.task-name');
			var $taskDescription = event.target.parentNode.querySelector('.task-description');

			createNewTask({
				name: $taskName.value,
				description: $taskDescription.value
			}).then(function(task) {
				$$taskList.appendChild(renderTask(task));
				$taskName.value = '';
				$taskDescription.value = '';
			});
		});
	}

	function loadTasks() {
		fetch('/api/task').then(function(response){
			if(response.ok) {
				return response.json();
			} 
		}).then(function(tasks){
			renderTasks(tasks);
		});
	}

	function renderTasks(tasks) {
		for(var i = 0; i < tasks.length; i++) {
			$$taskList.appendChild(renderTask(tasks[i]));
		}
	}

	function renderTask(task) {
		var $taskContainer = createBlock('grid-row');

		var $isDone = document.createElement('input');
		$isDone.type = 'checkbox';
		$isDone.checked = task.isDone;
		$isDone.className = 'grid-cell task-is-done';
		$taskContainer.appendChild($isDone);

		var $editableBlock = createBlock('editable hidden');
		$editableBlock.appendChild(createInput(task.name, 'grid-cell task-name'));
		$editableBlock.appendChild(createInput(task.description, 'grid-cell task-description'));
		$taskContainer.appendChild($editableBlock);

		var $block = createBlock('readonly');

		$block.appendChild(createText(task._id, 'grid-cell task-id hidden'));
		$block.appendChild(createText(task.name, 'grid-cell task-name'));
		$block.appendChild(createText(task.description, 'grid-cell task-description'));
		$taskContainer.appendChild($block);

		var $actionsContainer = createBlock('actions');

		var $editButton = createButton('Edit', 'edit-task', function() {
			showElement($editableBlock);
			hideElement($block);

			showElement($saveButton);
			hideElement($editButton);
		});
		$actionsContainer.appendChild($editButton);

		var $saveButton = createButton('Save', 'save-task hidden', function() {

			var isDone = $taskContainer.querySelector('.task-is-done').checked;
			var taskName = $editableBlock.querySelector('.task-name').value;
			var taskDescription = $editableBlock.querySelector('.task-description').value;

			var $taskIdReadonly = $block.querySelector('.task-id');
			var $taskNameReadonly = $block.querySelector('.task-name');
			var $taskDescriptionReadonly = $block.querySelector('.task-description');
			$taskNameReadonly.innerText = taskName;
			$taskDescriptionReadonly.innerText = taskDescription;

			showElement($block);
			hideElement($editableBlock);
			
			showElement($editButton);
			hideElement($saveButton);
			saveTask({
				_id: $taskIdReadonly.innerText,
				name: taskName,
				description: taskDescription,
				isDone: isDone
			});
		});
		$actionsContainer.appendChild($saveButton);

		$actionsContainer.appendChild(createButton('Delete', 'delete-task', function() {
			var taskIdReadonly = $block.querySelector('.task-id');
			deleteTask(taskIdReadonly.innerText).then(function() {
				$$taskList.removeChild($taskContainer);
			});
		}));

		$taskContainer.appendChild($actionsContainer);

		return $taskContainer;
	}

	function showElement(element) {
		if (element.className.indexOf('hidden')) {
			element.className = element.className.replace(/\b hidden\b/, '');
		}
	}

	function hideElement(element) {
		element.className += ' hidden';
	}

	function createBlock(className) {
		var $block = document.createElement('div');
		$block.className = className || '';
		return $block;
	}

	function createText(text, className) {
		var $textBlock = document.createElement('span');
		$textBlock.innerText = text;
		$textBlock.className = className || '';
		return $textBlock;
	}

	function createInput(text, className) {
		var $input = document.createElement('input');
		$input.value = text;
		$input.className = className || '';
		return $input;
	}

	function createButton(text, className, onClick) {
		var $button = document.createElement('button');
		$button.innerText = text;
		$button.className = className || '';
		$button.addEventListener('click', onClick);
		return $button;
	}

	function createNewTask(task) {
		return fetch('/api/task/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(task)
		}).then(function(response) {
			if (response.ok) {
				return response.json();
			}
		});
	}

	function saveTask(task) {
		return fetch('/api/task/' + task._id, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(task)
		});
	}

	function deleteTask(id) {
		return fetch('/api/task/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
	}
})();