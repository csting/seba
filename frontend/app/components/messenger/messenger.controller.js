(function () {
    angular.module('app').controller('MessengerCtrl', ['$scope', '$rootScope', '$stateParams', '$location', 'Socket', 'UserService', 'TripService',
        function ($scope, $rootScope, $stateParams, $location, Socket, UserService, TripService) {

            $scope.changeActiveChannel = function (location) {
                $scope.activeChannel = location;
            };


            var vm = this;
            vm.user = UserService.getUser();

            vm.messageArr = [];
            vm.userArr = [];
            vm.destinationsArr = [];
            vm.locationsArr = [];
            $scope.locationsVisited = [];

            // Prompt for setting a username
            var username = vm.user.surname;
            var name = vm.user.lastname;
            var typing = false;
            var lastTypingTime;

            var socket = Socket;

            // First CallBack: User Registration in Chat
            socket.on('login', function () {
                connected = true;
                // Display the welcome message


                TripService.getTrips(vm.user.email).then(function (req, res) {
                    for (var i = 0; i < req.data.length; i++) {
                        if (!req.data[i].locations[1]) {
                            var alllocations = JSON.parse(req.data[i].locations[0]);
                        }
                        else {
                            var alllocations = req.data[i].locations;
                        }

                        for (var l = 0; l < alllocations.length; l++) {
                            var location = alllocations[l];
                            if (vm.locationsArr.length == 0 && location.name) {
                                vm.locationsArr.push(location.name);
                            }
                            for (var m = 0; m < vm.locationsArr.length; m++) {
                                if (!location.name) {
                                    break;
                                }
                                if (vm.locationsArr[m] == location.name) {
                                    break;
                                }
                                if (m == vm.locationsArr.length - 1) {
                                    vm.locationsArr.push(location.name);
                                }
                            }
                        }
                    }
                    $scope.activeChannel = vm.locationsArr[0];
                });
                vm.addChatMessage({
                    user: "Sandalen Andy",
                    message: "welcome to Socks & Sandels Chat"
                }, $scope.activeChannel);
            });

            // Sends a chat message
            vm.sendMessage = function () {
                var message = vm.message;
                // if there is a non-empty message

                if (message) {
                    // tell server to execute 'new message' and send along one parameter
                    socket.emit('new message', message, $scope.activeChannel);
                    vm.message = '';
                }
            };

            // Adds the visual chat message to the message list
            vm.addChatMessage = function (message, channel) {
                vm.messageElement = {msg: '', channel: ''};
                vm.messageElement.msg = message;
                vm.messageElement.channel = channel;
                vm.messageArr.push(vm.messageElement);
            };

// Whenever the server emits 'new message', update the chat body
            socket.on('new message', function (message, channel) {
                vm.addChatMessage(message, channel);
            });

// Whenever the server emits 'user joined', log it in the chat body
            socket.on('user joined', function (username) {
                vm.userArr.push(username);
                socket.emit('refreshUsers', vm.userArr);
                vm.addChatMessage({
                    user: username,
                    message: "has joined"
                }, $scope.activeChannel);
            });

            socket.on('refreshUsers', function (userArr) {
                if (vm.userArr.length < userArr.length) {
                    vm.userArr = userArr;
                } else if (vm.userArr.length == userArr.length) {
                    vm.userArr.concat(userArr);
                }
            });

// Whenever the server emits 'user left', log it in the chat body
            socket.on('user left', function (username) {

                if (username != null) {
                    vm.userArr.splice(vm.userArr.indexOf(username), 1);
                    vm.addChatMessage({
                        user: username,
                        message: "has left"
                    }, $scope.activeChannel);
                }
            });


        }
    ])

})();