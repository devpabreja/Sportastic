const mongoose = require('mongoose');

const schema = mongoose.Schema;

//Event Schema
const eventSchema = new schema({
	name : String,
	numPlayers : Number,
	venue : String,
    details : String,
	equipments : String,
	description : String,
	admin : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "admin"
	},
	teams :[{
		type : mongoose.Schema.Types.ObjectId,
		ref : "team"
	}] 
}, {
    usePushEach: true   // Use Mongo $pushEach instead of deprecated $pushAll
});

const event = mongoose.model('event', eventSchema);

module.exports = event;

