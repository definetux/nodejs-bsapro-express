const io = require('socket.io');

const CONNECTION_EVENT = 'connection';
const TASK_UPDATED_EVENT = 'task_updated';
const FIB_UPDATED_EVENT = 'fib_updated';

class SocketService {
	connect(server) {
		const resolved = io(server);
		resolved.on(CONNECTION_EVENT, (socket) => {
			this.socket = socket;
			socket.on(TASK_UPDATED_EVENT, (msg) => {
				socket.broadcast.emit(TASK_UPDATED_EVENT);
			});
			socket.on(FIB_UPDATED_EVENT, (msg) => {
				socket.broadcast.emit(FIB_UPDATED_EVENT, msg);
			});
		});
	}

	send(evt, msg) {
		this.socket.emit(evt, msg);
	}

	subscribe(evt, callback) {
		this.socket.on(evt, callback);
	}
}

module.exports = new SocketService();