const express = require('express');
const task = express.Router();

const taskService = require('./taskService');

task.get('/', (req, res, next) => {
	console.log('asd');
	res.render('tasks');
});

task.get('/:id', (req, res, next) => {
	taskService.getTaskById(req.params.id).then((task)=> {
		res.render('task');
	}).catch((err) => {
		res.status(400).end();
	});
});

module.exports = task;
