(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', IndexController)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
            $httpProvider.interceptors.push('reqErrInterceptor');
        });

    function IndexController($rootScope, $location, $scope, UserService, $state, Socket) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

            if (UserService.loggedIn()) {
                
                var user = UserService.getUser();
                
                if (user.type == "company"){
                    $scope.navigation = "components/navigation/company/naviheader.tmpl.html";
                } else $scope.navigation = "components/navigation/traveler/naviheader.tmpl.html";
                
                
                updateUserImage(user.image);
                $scope.navigationShow = true;
                $scope.wide = true;
                
            } else {
                $scope.navigation = "";
                $scope.wide = false;
                $scope.navigationShow = false;
                $location.path('/login');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if ($state.is("messenger")) {
                Socket.emit('add user', UserService.getUser().surname + ' ' + UserService.getUser().lastname);
            } else if (!$state.is("messenger")) {
                Socket.emit('disconnectUser', UserService.getUser().surname + ' ' + UserService.getUser().lastname)
            }
        });

        $rootScope.logout = function () {
            UserService.logout();
            $location.path("/login");
        }

        function updateUserImage(imageurl) {

            if (imageurl == null) {
                $scope.imageUrl = "img/traveler_profile.png";
            } else $scope.imageUrl = imageurl;


        }
    }

})();