const io = require('socket.io-client');

class SocketService {
	constructor(url, port) {
		this.socket = io.connect(url + ':' + port);
		this.socket.on('connect', () => console.log('server connected'));
	}

	send(evt) {
		this.socket.emit(evt);
	}

	subscribe(evt, callback) {
		this.socket.on(evt, callback);
	}
}

module.exports = SocketService;