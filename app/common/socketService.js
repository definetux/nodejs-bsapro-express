const io = require('socket.io');

const CONNECTION_EVENT = 'connection';
const TASK_UPDATED_EVENT = 'task_updated';

class SocketService {
	connect(server) {
		this.test = "asd";
		const resolved = io(server);
		resolved.on(CONNECTION_EVENT, (socket) => {
			this.socket = socket;
			socket.on(TASK_UPDATED_EVENT, (msg) => {
				socket.broadcast.emit(TASK_UPDATED_EVENT);
			});
		});
	}

	send(evt) {
		console.log(this);
		this.socket.emit(evt);
	}

	subscribe(evt, callback) {
		this.socket.on(evt, callback);
	}
}

module.exports = new SocketService();