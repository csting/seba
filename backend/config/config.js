var Config = {};
Config.db = {};
Config.app={};
Config.auth = {};

Config.db.host = 'localhost:27017';
Config.db.name = 'socksandsandals';

// Use environment defined port or 3000
Config.app.port = process.env.PORT || 3000;
Config.app.socketport = 3001;

Config.auth.jwtSecret = "CHLOROPHORM";

//blabla
module.exports = Config;