const mongoose = require('mongoose');

const schema = mongoose.Schema;

//Team Schema
const teamSchema = new schema({
	tName : String,
	tId : String,
	participants : Number,
	captain :{
		type : mongoose.Schema.Types.ObjectId,
		ref : "player"
	}
}, {
    usePushEach: true   // Use Mongo $pushEach instead of deprecated $pushAll
});

const team = mongoose.model('Team', teamSchema);

module.exports = team;

