const SocketService = require('./SocketService');
const child_process = require('child_process');

class Math {
    constructor() {
		this.socketService = SocketService;
	}

    fib(n) {
        var child = child_process.fork(`${__dirname}/child.js`);
        return new Promise((res, rej) => {
            child.on('message', (msg) => {
                switch(msg.type) {
                    case 'result':
                        child.kill();
                        res(msg.data);
                        break;
                    case 'temp': 
                        this.socketService.broadcast(this.socketService.FIB_UPDATED_EVENT, msg.data);
                };
            });

            child.send(n);
        });
    }
}

module.exports = Math;