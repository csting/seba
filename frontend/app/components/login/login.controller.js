(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginCtrl', function ($scope, $location, UserService, FlashService, Facebook) {


            $scope.activeTemplate = "components/partials/loginform.tmpl.html";

            $scope.registerDelegate = function () {

                $scope.activeTemplate = "components/partials/registerform.tmpl.html"
            }

            $scope.registerUser = function () {

                var user = $scope.registerUser;

                UserService.register(user.email, user.password, user.surname, user.lastname, user.type, user.age).then(function () {
                    $location.path("/marketplace");
                }, function (response) {
                    if (response.status == 400 || response.status == 401) {
                        FlashService.Error(response.data);
                    } else {
                        FlashService.Error("An unknown error occured. Please try again later.");
                    }
                });

            };

            $scope.backToLogin = function () {
                if (!($scope.activeTemplate = "components/partials/loginform.tmpl.html")) {
                    $scope.activeTemplate = "components/partials/loginform.tmpl.html";
                }

            };

            $scope.forgotPassword = function () {
                if ($scope.activeTemplate != "components/partials/passwordform.tmpl.html") {
                    $scope.activeTemplate = "components/partials/passwordform.tmpl.html";
                }
            };
            
            $scope.loginFacebook = function () {
                UserService.loginFacebook();
            }

            Facebook.getLoginStatus(function (response) {
                if (response.status === 'connected') {


                    var fbid = $location.search();

                    if (fbid.hasOwnProperty('id') && fbid.id != null) {
                        UserService.getFBUser(fbid.id).then(function (user) {
                                $location.search('id', null);
                                $location.path("/marketplace");

                            })
                            .catch(function (error) {
                                FlashService.Error(error.data);
                            });
                    }

                }

            });


            $scope.loginUser = function () {

                var user = $scope.loginUser;

                UserService.login(user.email, user.password).then(function () {
                    FlashService.Success('Login Success');
                    $location.path("/marketplace");
                }, function (response) {
                    if (response.status == 400 || response.status == 401) {
                        FlashService.Error(response.data);
                    } else {
                        FlashService.Error("An unknown error occured. Please try again later.");
                    }
                });
            }


        })

})();