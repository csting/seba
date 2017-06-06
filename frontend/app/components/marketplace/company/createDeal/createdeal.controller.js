(function () {

    angular
        .module('app')

        .controller('NewDealCtrl', function (DealService, UserService, FlashService, Upload) {

            var vm = this;

            var user = UserService.getUser();
            vm.step = 1;
            vm.today = new Date();
            vm.deal = "";
            vm.errors = 0;
            var start;
            var end;
            var input = document.getElementById('pac-input');
            var options = {
                types: ['(cities)']
            };
            var autocomplete = new google.maps.places.Autocomplete(input, options);

            vm.saveDeal = function () {
                vm.deal.location = autocomplete.getPlace();
                // Converting picture to String
                if (vm.deal.picture) {
                    Upload.base64DataUrl(vm.deal.picture).then(function (base64picture) {
                        vm.deal.picture = base64picture;
                        DealService.saveDeal(vm.deal, user.email).then(function () {
                                FlashService.Success("Deal created");
                            })
                            .catch(function (err) {
                                FlashService.Error("You have not filled out the form correctly!");
                            });
                    });
                } else {
                    DealService.saveDeal(vm.deal, user.email).then(function () {
                            FlashService.Success("Deal created");
                        })
                        .catch(function (err) {
                            FlashService.Error("You have not filled out the form correctly!");
                        });
                }

            };

            vm.prevstep = function () {
                vm.step = vm.step - 1;
            };

            vm.nextstep = function (step) {
                if (step == 1) {
                    if (vm.deal.hasOwnProperty('name') && vm.deal.name) {
                        if (vm.deal.hasOwnProperty('location') && vm.deal.location) {
                            if (vm.deal.hasOwnProperty('shortdescription') && vm.deal.shortdescription) {
                                if (vm.deal.hasOwnProperty('category')) {
                                    for (var i = 0; i < 6; i++) {
                                        if (vm.deal.category[i]) {
                                            vm.step = vm.step + 1;
                                            if(vm.errors != 0){
                                                FlashService.Success("You have successfully completed Step 1!");
                                            }
                                            break;
                                        }
                                        if (i == 5 && !vm.deal.category[5]) {
                                            vm.errors +=1;
                                            FlashService.Error("You have not selected a category!");//category false
                                        }
                                    }
                                }
                                else {
                                    vm.errors +=1;
                                    FlashService.Error("You have not selected a category!"); //category doesnt exist
                                }
                            }
                            else {
                                vm.errors +=1;
                                FlashService.Error("You have not entered a valid description!");
                            }
                        }
                        else {
                            vm.errors +=1;
                            FlashService.Error("You have not selected a valid location!");
                        }
                    }
                    else {
                        vm.errors +=1;
                        FlashService.Error("You have not filled out all required fields!");
                    }
                }

                else if (step == 2) {
                    if (vm.deal.hasOwnProperty('conditions') && vm.deal.conditions) {
                        if (vm.deal.hasOwnProperty('amount') && vm.deal.amount) {
                            if (vm.deal.hasOwnProperty('startdate') && vm.deal.startdate) {
                                if (vm.deal.hasOwnProperty('enddate') && vm.deal.enddate) {
                                    vm.deal.daysleft = 0;
                                    vm.step = vm.step + 1;
                                    if(vm.errors != 0){
                                        FlashService.Success("You have successfully completed Step 2!");
                                    }
                                }
                                else {
                                    vm.errors +=1;
                                    FlashService.Error("You have not selected a valid end date!");
                                }
                            }
                            else {
                                vm.errors +=1;
                                FlashService.Error("You have not selected a valid start date!");
                            }
                        }
                        else {
                            vm.errors +=1;
                            FlashService.Error("You have not selected a valid amount of vouchers!");
                        }
                    }
                    else {
                        vm.errors +=1;
                        FlashService.Error("You have not filled out all required fields!");
                    }
                }

                else if (step == 3) {
                    if (vm.deal.targetgroup == "everyone") {
                        vm.step = vm.step + 1;
                    }
                    else if (vm.deal.targetgroup == "specify") {
                        if (vm.deal.hasOwnProperty('targetgroupgender')) {
                            for (var i = 0; i < 2; i++) {
                                if (vm.deal.targetgroupgender[i]) {
                                    vm.step = vm.step + 1;
                                    if(vm.errors != 0){
                                        FlashService.Success("You have successfully completed Step 3!");
                                    }
                                    break;
                                }
                            }
                            if (vm.deal.hasOwnProperty('targetgroupage')) {
                                if (vm.step == 3) {
                                    for (var l = 0; l < 3; l++) {
                                        if (vm.deal.targetgroupage[l]) {
                                            vm.step = vm.step + 1;
                                            if(vm.errors != 0){
                                                FlashService.Success("You have successfully completed Step 3!");
                                            }
                                            break;
                                        }
                                        if (l == 2 && !vm.deal.targetgroupage[2]) {
                                            vm.errors +=1;
                                            FlashService.Error("You have not specified the target group!"); //both false
                                        }
                                    }
                                }
                            }
                            else {
                                vm.errors +=1;
                                FlashService.Error("You have not specified the target group!"); //gender false, age doesn't exist
                            }
                        }

                        if (!vm.deal.hasOwnProperty('targetgroupgender')) {
                            if (vm.deal.hasOwnProperty('targetgroupage')) {
                                if (vm.step == 3) {
                                    for (var l = 0; l < 3; l++) {
                                        if (vm.deal.targetgroupage[l]) {
                                            vm.step = vm.step + 1;
                                            if(vm.errors != 0){
                                                FlashService.Success("You have successfully completed Step 3!");
                                            }
                                            break;
                                        }
                                        if (l == 2 && !vm.deal.targetgroupage[2]) {
                                            vm.errors +=1;
                                            FlashService.Error("You have not specified the target group!"); //age false, gender doesn't exist
                                        }
                                    }
                                }
                            }
                            if (!vm.deal.hasOwnProperty('targetgroupage')) {
                                vm.errors +=1;
                                FlashService.Error("You have not specified the target group!"); //none exist
                            }
                        }
                    }
                }

                else {
                    vm.errors +=1;
                    FlashService.Error("You have not filled out all required fields!");//general error
                }
            };
        });
})();