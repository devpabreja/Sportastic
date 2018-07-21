const mongoose = require('mongoose');

const schema = mongoose.Schema;

//Match Schema
const matchSchema = new schema({
	matchId : String,
	team1 : String,
	team2 : String,
	result : String,
	time : String,

	event :{
		type : mongoose.Schema.Types.ObjectId,
		ref : "event"
	}
}, {
    usePushEach: true   // Use Mongo $pushEach instead of deprecated $pushAll
});

const match = mongoose.model('Match', matchSchema);

module.exports = match;

