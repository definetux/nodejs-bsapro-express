const task = require('koa-router')();

task.get('', async (ctx, next) => {
	await ctx.render('tasks');
});

module.exports = task;