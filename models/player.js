const mongoose = require('mongoose');

const schema = mongoose.Schema;

//Player Schema
const playerSchema = new schema({
	name : String,
	username : String,
	password : String,
	email : String,
	DOB : String,
	university : String, 
	isCaptiain : Boolean,
	teamName :{
		type : mongoose.Schema.Types.ObjectId,
		ref : "team"
	} 
}, {
    usePushEach: true   // Use Mongo $pushEach instead of deprecated $pushAll
});

const player = mongoose.model('Player', playerSchema);

module.exports = player;

