(function () {

    var app = angular.module('app');

    app.controller('newTripCtrl', ['$scope', 'FlashService', 'TripService', 'UserService', 'ngDialog', function ($scope, FlashService, TripService, UserService, ngDialog) {
        var input = document.getElementById('pac-input');
        var options = {
            types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        var place = autocomplete.getPlace();
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 45, lng: -73},
            zoom: 2
        });
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">You want to travel here?</h1>' +
            '<div id="bodyContent">' +
            '<p>There are currently <b>20 other traveler</b> in this location.</p>' +
            '</div>' +
            '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        $scope.destinations = [];
        $scope.newDestination = {destination: '', color: '', destinationType: ''};
        $scope.trip = {name: '', destinations: []};
        $scope.selectedLocation = 0;
        var m = Array();
        var p = Array();
        $scope.locations = [];
        var showMarker = function () {
            for (var i = 0; i < m.length; i++) {
                m[i].setMap(null);

            }
            for (var j = 0; j < p.length; j++) {
                p[j].setMap(null);
            }
            m = [];
            p = [];
            for (i = 0; i < $scope.locations.length; i++) {
                try {
                    var lat = $scope.locations[i].geometry.location.lat();
                    var lng = $scope.locations[i].geometry.location.lng();
                }
                catch (e) {
                    var lat = $scope.locations[i].geometry.location.lat;
                    var lng = $scope.locations[i].geometry.location.lng;
                }
                if (i < $scope.locations.length - 1) {
                    try {
                        var nextLat = $scope.locations[i + 1].geometry.location.lat();
                        var nextLng = $scope.locations[i + 1].geometry.location.lng();
                    }
                    catch (e) {
                        var nextLat = $scope.locations[i + 1].geometry.location.lat;
                        var nextLng = $scope.locations[i + 1].geometry.location.lng;
                    }
                }
                var newMarker = new google.maps.Marker(
                    {
                        position: {
                            lat: lat,
                            lng: lng
                        },
                        label: (i + 1).toString(),
                        map: map
                    });
                newMarker.addListener('click', function () {
                    infowindow.open(map, this);
                });
                m.push(newMarker);
                if (i < $scope.locations.length - 1) {
                    // Create the polyline and add the symbol via the 'icons' property.
                    var line = new google.maps.Polyline({
                        path: [{
                            lat: lat,
                            lng: lng
                        }, {
                            lat: nextLat,
                            lng: nextLng
                        }],
                        icons: [{
                            icon: lineSymbol,
                            offset: '100%'
                        }],
                        strokeColor: '#00A6D0',
                        map: map
                    });
                    p.push(line);
                }
            }
        };


        $scope.saveTrip = function () {

            var trip = JSON.stringify($scope.locations);
            $scope.trip.destinations = $scope.destinations;

            if ($scope.trip.destinations.length > 1 && $scope.trip.name.length > 3) {


                TripService.saveTrip(trip, UserService.getUser().email, $scope.trip.name).then(function () {
                        FlashService.Success('Trip created');
                    })
                    .catch(function (error) {
                        FlashService.Error(error.data);
                    });
                ngDialog.open({
                    template: 'templateId',
                    scope: $scope,
                    width: '50%',
                    showClose: false
                });

            } else FlashService.Error("You have not defined enough destinations or your trips name isn't long enough!");
        };

        $scope.goToLocation = function (i) {
            $scope.selectedLocation = i;
            map.fitBounds($scope.locations[i].geometry.viewport);
        };

        $scope.saveDestination = function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            if (place.geometry.viewport) {
                var position = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
                var newLocation = {position: position};
                $scope.locations.push(place);
                $scope.selectedLocation = $scope.locations.length - 1;
                map.fitBounds(place.geometry.viewport);
                showMarker();
            }

            $scope.newDestination.destination = autocomplete.getPlace().formatted_address;
            if ($scope.newDestination.destination.length > 2) {
                if ($scope.destinations.length == 0) {
                    $scope.newDestination.color = 'green';
                    $scope.newDestination.destinationType = 'Start destination';
                } else if ($scope.destinations.length == 1) {
                    $scope.newDestination.color = 'red';
                    $scope.newDestination.destinationType = 'Final destination'
                } else {
                    tempDestination = $scope.destinations[$scope.destinations.length - 1];
                    tempDestination.color = 'darkblue';
                    tempDestination.destinationType = 'Stopover';
                    $scope.destinations[$scope.destinations.length - 1] = tempDestination;

                    $scope.newDestination.color = 'red';
                    $scope.newDestination.destinationType = 'Final destination';
                }


                $scope.destinations.push($scope.newDestination);

                $scope.newDestination = {destination: '', color: '', destinationType: ''};
                autocomplete = new google.maps.places.Autocomplete(input, options);
            }
        };

        $scope.deleteDestination = function (index) {

            $scope.destinations.splice(index, 1);
            $scope.locations.splice(index, 1);

            showMarker();

            if ($scope.destinations.length > 0) {
                tempDestination = $scope.destinations[$scope.destinations.length - 1];
                tempDestination.color = 'red';
                tempDestination.destinationType = 'Final destination';
                $scope.destinations[$scope.destinations.length - 1] = tempDestination;

                tempDestination = $scope.destinations[0];
                tempDestination.color = 'green';
                tempDestination.destinationType = 'Start destination';
                $scope.destinations[0] = tempDestination;
            }
        }

        $scope.hasLocations = function () {
            if ($scope.locations.length > 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.$watchCollection('locations', function (newCol, oldCol, scope) {
            showMarker();
        });

        $scope.isSelected = function (index) {
            if (index == $scope.selectedLocation) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.getTrips = function () {
            $scope.foundTrips = TripService.getTrips();
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        };


    }])

})();

