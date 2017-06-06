(function () {

    angular
        .module('app', ['ui.router', 'uiGmapgoogle-maps','btford.socket-io', 'zingchart-angularjs', 'dndLists', 'ngDialog', 'ngFileUpload', 'ngImgCrop', 'facebook'])
        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyDiDsPVQLUV4D3zDfyQOXnlkzrIVfNWa_Q',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'visualization'
            })
        })
        .config(stateConfig)
        .config(function(FacebookProvider) {
            FacebookProvider.init('630316213785028');
        });


    function stateConfig($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'components/login/login.tmpl.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .state('marketplace', {
                url: '/marketplace',
                templateUrl: 'components/marketplace/marketplace.tmpl.html',
                controller: 'marketplaceCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'marketplace'},
                authenticate: true
            })
            .state('fbsuccess', {
                url: '/fbsuccess',
                templateUrl: 'components/login/login.tmpl.html',
                controller: 'loginCtrl'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'components/account/account.tmpl.html',
                controller: 'accountCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'account'},
                authenticate: true
            })
            .state('mytrips', {
                url: '/mytrips',
                templateUrl: 'components/mytrips/mytripsSummary/index.html',
                controller: 'myTripCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'mytrips'},
                authenticate: true
            })
            .state('createTrip', {
                url: '/createtrip',
                templateUrl: 'components/mytrips/mytrips.tmpl.html',
                controller: 'newTripCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'mytrips'},
                authenticate: true
            })
            .state('travelanalytics', {
                url: '/travelanalytics',
                templateUrl: 'components/travelanalytics/travelanalytics.tmpl.html',
                controller: 'TravelAnalyticsCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'travelAnalytics'},
                authenticate: true
            })
            .state('messenger', {
                url: '/messenger',
                templateUrl: 'components/messenger/messenger.tmpl.html',
                controller: 'MessengerCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'messenger'},
                authenticate: true
            })
            .state('editTrip', {
                url: '/editTrip/:id',
                templateUrl: 'components/mytrips/editTrip/mytrips.tmpl.html',
                controller: 'editTripCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'mytrips'},
                authenticate: true
            })
            .state('createDeal',{
                url:'/createdeal',
                templateUrl: 'components/marketplace/company/createdeal/createdeal.tmpl.html',
                controller: 'NewDealCtrl',
                controllerAs: 'vm',
                data: {activeTab: 'marketplace'},
                authenticate: true
            });
    }
})();
