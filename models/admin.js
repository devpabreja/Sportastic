const mongoose = require('mongoose');

const schema = mongoose.Schema;

//Admin Schema
const adminSchema = new schema({
	name : String,
	username : String,
	password : String,
	email : String,
	DOB : String,
	university : String,
	mobile : Number, 
	events :[{
		type : mongoose.Schema.Types.ObjectId,
		ref : "event"
	}]
}, {
    usePushEach: true   // Use Mongo $pushEach instead of deprecated $pushAll
});

const admin = mongoose.model('Admin', adminSchema);

module.exports = admin;

