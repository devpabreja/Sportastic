const mongoose = require("mongoose");

const Admin = require('./admin');
const Match = require('./matches');
const Player = require('./player');
const Team = require('./team');
const Event  = require('./activities');

const CONFIG = require("../config");

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${CONFIG.DB.HOST}:${CONFIG.DB.PORT}/${CONFIG.DB.NAME}`)
    .then(() => {
        console.log(`Database ${CONFIG.DB.NAME} Ready for Use!`);
    })
    .catch(err => {
        console.log(`Error connecting to Database: ${err}`);
    });

module.exports = {Admin, Match, Player, Team, Event};