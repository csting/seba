(function () {

    var app = angular.module('app');
    app.controller('myTripCtrl', function ($rootScope, $scope, $state, FlashService, TripService, UserService,ngDialog) {

        var vm = this;
        
        vm.user = UserService.getUser();
        
        var email = UserService.getUser().email;

        $scope.getTrips = function() {
            $scope.trips = [];
            TripService.getTrips(email).then(function (req, res) {
                for (i = 0; i < req.data.length; i++) {
                    if(!req.data[i].locations[0].name){
                        var locations = JSON.parse(req.data[i].locations);
                    } else {
                        var locations = req.data[i].locations;
                    }


                    var trip = {"_id":req.data[i]._id,"name":req.data[i].title,"locations": locations};
                    $scope.trips.push(trip);
                }

            })
                .catch(function (error) {
                    FlashService.Error(error.data);
                });

        };

        $scope.getTrips();

        $scope.editTrip = function(trip) {
            routes.goToLocation('createTrip');
        }



        $scope.deleteTrip = function(_id) {
            TripService.deleteTrip(_id).then(function () {

                    $scope.getTrips();

            })
        };

        $scope.getDetails = function (trip) {
            $scope.detailTrip = trip;
            ngDialog.open({
                template: 'templateId',
                scope: $scope,
                width: '50%'
            });

        }
    })

})();

