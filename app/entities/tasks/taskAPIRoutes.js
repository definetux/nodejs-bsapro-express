const task = require('koa-router')();
const FormatError = require('../../common/FormatError');

const taskService = require('./taskService');

task.get('/', async (ctx, next) => {
	try {
		const tasks = await taskService.getAllTasks();
		ctx.body = tasks;
	} catch (err) {
		console.log(err);
		ctx.status = 400;
	}
});

task.post('/', async (ctx, next) => {
	try {
		const task = await taskService.addTask(ctx.request.body);
		ctx.status = 201;
		ctx.body = task;
	} catch (err) {
		console.log(err);
		if (err instanceof FormatError) {
			ctx.status = 400;
		} else {
			ctx.status = 500;
		}
	}
});

task.get('/:id', async (ctx, next) => {
	try {
		const task = await taskService.getTaskById(ctx.params.id);
		ctx.body = task;
	} catch (err) {
		console.log(err);
		ctx.status = 400;
	}
});

task.put('/:id', async (ctx, next) => {
	try {
		await taskService.editTask(ctx.params.id, ctx.request.body);
	} catch (err) {
		console.log(err);
		if (err instanceof FormatError) {
			ctx.status = 400;
		} else {
			ctx.status = 500;
		}
	}
});

task.put('/:id/changeState', async (ctx, next) => {
	try {
		await taskService.changeState(ctx.params.id, ctx.request.body.state);
	} catch(err) {
		ctx.status = 400;
	}
});

task.delete('/:id', async (ctx, next) => {
	try {
		await taskService.deleteTask(ctx.params.id);
		ctx.status = 200;
	} catch (err) {
		console.log(err);
		ctx.status = 400;
	}
});

module.exports = task;
