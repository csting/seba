(function () {

    var app = angular.module('app');

    app.controller('TravelAnalyticsCtrl', ['$scope', 'FlashService', 'TripService', 'UserService', function ($scope, FlashService, TripService, UserService) {
        var input = document.getElementById('pac-input');
        var options = {
            types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        $scope.searched = false;
        $scope.branch = "Restaurant";
        $scope.today = Date();

        $scope.searchTravelers = function () {
            $scope.included = [];
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                FlashService.Error("You have not entered a valid location!");
                return;
            }
            $scope.searched = true;
            $scope.foundTrips = [];
            TripService.getAllTrips().then(function (req, res) {
                for (i = 0; i < req.data.length; i++) {
                    if (!req.data[i].locations[0].name) {
                        var locations = JSON.parse(req.data[i].locations);
                    } else {
                        var locations = req.data[i].locations;
                    }
                    for (l = 0; l < locations.length; l++) {
                        if (locations[l].name == autocomplete.gm_accessors_.place.Fc.place.name) {
                            switch ($scope.branch) {
                                case 'Restaurant':
                                    if (locations[l].restaurants) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;
                                case 'Event':
                                    if (locations[l].events) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;
                                case 'Bar':
                                    if (locations[l].bars) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;
                                case 'Accommodation':
                                    if (locations[l].accommodations) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;
                                case 'Nightclub':
                                    if (locations[l].nightclubs) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;
                                case 'Transportation':
                                    if (locations[l].transportations) {
                                        var matchTrip = {
                                            id: req.data[i]._id,
                                            title: req.data[i].title,
                                            startDate: locations[l].startDate,
                                            stopDate: locations[l].stopDate
                                        };
                                        if (Date.parse(matchTrip.startDate) >= Date.parse($scope.today)) {
                                            $scope.foundTrips.push(matchTrip);
                                        }
                                    }
                                    break;


                            }
                        }
                    }
                }
                $scope.amountTraveler = $scope.foundTrips.length;
                $scope.location = autocomplete.gm_accessors_.place.Fc.place.name;
            });

        };
    }])

})();

