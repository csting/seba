(function () {
    'use strict';

    angular
        .module('app')
        .controller('accountCtrl', ['$scope', '$location', '$http', '$timeout', 'UserService', 'FlashService', '$state', function ($scope, $location, $http, $timeout, UserService, FlashService, $state) {
            var vm = this;
            vm.user = null;


            $scope.upload = function (dataUrl) {


                UserService.uploadUserImage({
                    email: UserService.getUser().email,
                    file: dataUrl
                }).then(function () {
                        FlashService.Success('Image is uploaded')
                        $state.go($state.current, {}, {reload: true});
                    })
                    .catch(function (error) {
                        FlashService.Error(error.data);
                        console.log(error);
                    });
            };

            initController();

            function initController() {
                // get current user
                vm.user = UserService.getUser();
                vm.user.age = new Date(vm.user.age);

                if (vm.user.provider == "facebook") {
                    vm.facebookUserPassword = false
                } else vm.facebookUserPassword = true

                if (vm.user.type == "company") {
                    vm.company = false
                } else vm.company = true
            }

            $scope.updateUser = function () {
                UserService.updateUser(vm.user.email, vm.user.oldPassword, vm.user.newPassword, vm.user.surname, vm.user.lastname, vm.user.age).then(function () {
                        FlashService.Success("User successfully updated");
                        var newuser = UserService.getUser();
                    })
                    .catch(function (error) {
                        FlashService.Error(error.data);
                    });
                ;
            };

            $scope.deleteUser = function () {
                // get current user
                UserService.deleteUser(vm.user._id)
                    .then(function () {
                        // log user out
                        FlashService.Success("Successfully deleted your Account")
                        UserService.logout();
                        $location.path("/login");
                    })
                    .catch(function (error) {
                        FlashService.Error(error.data);
                    });
            }
        }])

})();