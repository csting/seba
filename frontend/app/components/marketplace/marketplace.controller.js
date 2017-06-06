(function () {

    //Ramp up
    angular.module('app').controller('marketplaceCtrl', Controller);


    function Controller($scope, UserService, TripService, DealService) {

        var vm = this;
        vm.user = UserService.getUser();
        $scope.mydeals = [];
        var alllocations = [];
        vm.diffdeals = [];


        //if Company User
        if (vm.user.type == "company") {
            $scope.marketplace = "components/marketplace/company/marketplace.company.tmpl.html";
        } else $scope.marketplace = "components/marketplace/traveler/marketplace.traveler.tmpl.html";


        //getDeals
        vm.deals = [];
        DealService.getDeals(vm.user.email).then(function (req, res) {
            vm.deals = req.data;
            if (vm.deals[0]) {
                for (var i = 0; i < 1; i++) {
                    vm.deals[i].daysleft = moment(vm.deals[i].enddate).diff(moment(), 'days');
                }
            }
        });

        //getAllDeals
        vm.otherdeals = [];
        DealService.getAllDeals().then(function (req, res) {
            vm.otherdeals = req.data;

            if (vm.otherdeals[0]) {
                otheroffers();
            }
        });

        $scope.active = function () {
            var active = false;
            for (var l = 0; l < vm.deals.length; l++) {
                if (vm.deals[l].daysleft >= 0) {
                    var active = true;
                    break;
                }
            }
            return active;
        };

        $scope.expired = function () {
            var expired = false;
            for (var k = 0; k < vm.deals.length; k++) {
                if (vm.deals[k].daysleft < 0) {
                    var expired = true;
                    break;
                }
            }
            return expired;
        };

        function otheroffers() {
            for (var j = 0; j < vm.otherdeals.length; j++) {
                if (vm.otherdeals[j].email != vm.user.email) {
                    vm.diffdeals.push(vm.otherdeals[j]);
                    break;
                }
            }
        }

        //Carousel expired
        $scope.carouselPrevEx = function () {
            $('[id^="myCarousel-expired"]').carousel('prev');
        };
        $scope.carouselNextEx = function () {
            $('[id^="myCarousel-expired"]').carousel('next');
        };

        //Carousel other
        $scope.carouselPrev = function () {
            $('[id^="myCarousel-other"]').carousel('prev');
        };
        $scope.carouselNext = function () {
            $('[id^="myCarousel-other"]').carousel('next');
        };

        $scope.getSelectedDeals = function () {
            DealService.getAllDeals().then(function (req, res) {
                    for (var i = 0; i < req.data.length; i++) {
                        for (var l = 0; l < alllocations.length; l++) {
                            for (var m = 0; m < alllocations[l].length; m++) {
                                if (req.data[i].location[0].name == alllocations[l][m].name) {
                                    var isIN = false;
                                    for (var d = 0; d < $scope.mydeals.length; d++) {
                                        if (req.data[i]._id == $scope.mydeals[d]._id) {
                                            isIN = true;
                                        }
                                    }
                                    if (!isIN) {
                                        $scope.mydeals.push(req.data[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            );
        };


        TripService.getTrips(vm.user.email).then(function (req, res) {
            for (var i = 0; i < req.data.length; i++) {
                if (!req.data[i].locations[1]) {
                    alllocations.push(JSON.parse(req.data[i].locations));
                    $scope.getSelectedDeals();
                }
                else {
                    alllocations.push(req.data[i].locations);
                    $scope.getSelectedDeals();
                }
            }
        });


        //Carousel
        $scope.carouselHotPrev = function () {
            $('.carousel').carousel('prev');
        };
        $scope.carouselHotNext = function () {
            $('.carousel').carousel('next');
        };

    }

})
();