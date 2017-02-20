var io = require('socket.io')();

class SocketService {
	constructor() {
		this.io = io;
		this.TASK_UPDATED_EVENT = 'TASK_UPDATED_EVENT';
		this.FIB_UPDATED_EVENT = 'FIB_UPDATED_EVENT';
	}

	connect(server, adapter) {
		if (adapter) {
			this.io.adapter(adapter);
		}
		this.io.listen(server);
		io.on('connection', (socket) => this.socket = socket);
	}

	send(ev, msg) {
		this.socket.broadcast.emit(ev, msg);
	}
	broadcast(ev, msg) {
		this.io.emit(ev, msg);
	}
}

module.exports = new SocketService();