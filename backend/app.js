var Config = require('./config/config.js');

/**
 * db connect
 */

var mongoose = require('mongoose');
var morgan = require('morgan');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

/**
 * create application
 */

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(Config.app.socketport, function () {
    console.log('Listening on Socketport: ' + Config.app.socketport);
});

app.use(morgan('dev'));


/**
 * app setup
 */

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



//passport

var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');
var facebookConfig = require('./passport/facebookConfig');

app.use(passport.initialize());
jwtConfig(passport);
facebookConfig(passport);



io.sockets.on('connection', function (socket) {
    var addedUser = false;

    var connectedUsers = [];

    // First Call: User Registration in Chat
    socket.on('add user', function (username) {
        if (addedUser) return;


        // we store the username in the socket session for this client
        socket.username = username;


        addedUser = true;
        socket.emit('login');
        // echo globally (all clients) that a person has connected
        io.sockets.emit('user joined', socket.username
        );
    });


    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (message, channel) {
        // we tell the client to execute 'new message'

        io.sockets.emit('new message', {
            user: socket.username,
            message: message
        }, channel);
    });


    //Location of the Client as get from the DB
    socket.on('locations', function (data) {
        io.sockets.emit('locations', {
            locations: socket.locations
        });
    });

    //Disconnect by function call
    socket.on('disconnectUser', function (username) {
        console.log(connectedUsers);

        addedUser = false;
        io.sockets.emit('user left', socket.username);
        connectedUsers.splice(connectedUsers.indexOf(socket.username),1);
    });

    socket.on('refreshUsers', function (userArr) {
        console.log("income refreshUsers");
        console.log(userArr);
        console.log(connectedUsers);
        if (connectedUsers.length < userArr.length){
            connectedUsers = userArr;
            io.sockets.emit('refreshUsers',userArr);
        }else if (connectedUsers.length == userArr.length){
            connectedUsers.concat(userArr);
        }
    });
    
    //Disconnect on site exit
    socket.on('disconnect', function () {
        console.log(connectedUsers);

        addedUser = false;
        io.sockets.emit('user left', socket.username);
        connectedUsers.splice(connectedUsers.indexOf(socket.username),1);
    });

});


/**
 * routing
 */

var userRoutes = require("./models/user/userRoutes");
var tripRoutes = require("./models/trip/tripRoutes");
var dealRoutes = require("./models/deal/dealRoutes");


app.use('/', userRoutes(passport));
app.use('/', tripRoutes(passport));
app.use('/', dealRoutes(passport));

module.exports = app;