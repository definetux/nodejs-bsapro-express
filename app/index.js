const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const views = require('koa-views');
const serve = require('koa-static');
const path = require('path');
const taskService = require('./entities/tasks/taskService');


// app.use(route.get('/', list));
// app.use(serve(path.join(__dirname, 'public')));

app.use(views(__dirname + '/../../views', {
  extension: 'pug'
}));

app.use(route.get('/', home));


function *home(ctx, next) {
  console.log('render');
  this.body = ctx.render('index');
};

function *list() {
	this.body = yield taskService.getAllTasks();
}

app.on('error', function(err, ctx){
  log.error('server error', err);
  ctx.res.status = err.status;
});

app.listen(2222);