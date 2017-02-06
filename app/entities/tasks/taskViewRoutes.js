const task = require('koa-router')();

task.get('', async (ctx, next) => {
	console.log('asd');
	await ctx.render('tasks');
});

module.exports = task;