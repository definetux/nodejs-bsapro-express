const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Task = new mongoose.Schema({
	name: String,
	description: String,
	isDone: Boolean
});

Task.methods.getViewModel = function(){
	return {
		_id: this._id,
		name: this.name,
		description: this.description,
		isDone: this.isDone
	};
};

module.exports = mongoose.model('Task', Task);