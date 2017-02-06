class Test {
	constructor() {
		this.state = "test";
	}

	changeState() {
		this.state = "no test";
	}
}

module.exports = new Test();