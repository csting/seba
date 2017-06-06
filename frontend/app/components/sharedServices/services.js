(function () {
    angular.module('app');

    var SECURE_URI = 'http://localhost:3000/api/';
    var DEFAULT_URI = 'http://localhost:3000/';

    angular.module('app').value('connection', {
        baseUri: DEFAULT_URI,
        secUri: SECURE_URI
    });

})();

(function () {

    angular.module('app')
        .factory("reqErrInterceptor", reqErrInterceptor);

    function reqErrInterceptor(connection, $injector, $q, FlashService) {


        return {
            responseError: responseError
        };

        function responseError(rej) {
            if ([-1, 404].indexOf(rej.status) !== -1) {
                showAlert({title: 'Connection Error', msg: 'Could not reach the server. Try again later'});
            } else {
                showAlert({title: 'Unknown Error', msg: 'Unknown error. Try again later'});
            }

            return $q.reject(rej);
        }

        function showAlert(opt) {
            //inject manually to resolve circular dependency error

            FlashService.Error(opt.msg);

        }

    }

})();

//AUTHENTICATION

(function () {

    angular.module('app')
        .factory("authInterceptor", authInterceptor);

    function authInterceptor(connection, auth) {
        return {
            // automatically attach Authorization header

            request: function (config) {

                var token = auth.getToken();

                if (token && auth.parseJwt(token).exp * 1000 < new Date()) {
                    token = null;
                    auth.deleteToken();
                }

                if (config.url.indexOf(connection.baseUri) === 0 && token) {
                    config.headers.Authorization = 'JWT ' + token;
                }

                return config;
            },

            response: function (res) {

                if (res.config.url.indexOf(connection.baseUri) === 0 && res.data.token) {

                    if (auth.getToken()) {
                        auth.refreshToken(res.data.token);
                    } else auth.saveToken(res.data.token);
                }

                return res;
            }
        }
    }
})();

(function () {

    angular.module('app')
        .service('auth', authService);

    function authService($window) {

        var self = this;
        this.token;


        this.isAuthed = isAuthed;
        this.parseJwt = parseJwt;
        this.saveToken = saveToken;
        this.getToken = getToken;
        this.deleteToken = deleteToken;
        this.refreshToken = refreshToken;

        function saveToken(t) {
            $window.localStorage['jwtToken'] = t;
        }

        function refreshToken(t) {
            $window.localStorage.removeItem('jwtToken')
            $window.localStorage['jwtToken'] = t;
        }

        function getToken() {
            return $window.localStorage['jwtToken'];
        }

        function deleteToken() {
            $window.localStorage.removeItem('jwtToken');
        }

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        function isAuthed() {
            var token = getToken();

            if (token) {
                return true;
            } else {
                return false;
            }
        }
    }

})();

(function () {

    angular.module('app')
        .service('UserService', userService);

    function userService(connection, $http, $window, auth) {

        this.register = register;
        this.login = login;
        this.loggedIn = auth.isAuthed;
        this.logout = auth.deleteToken;
        this.getUser = getUser;
        this.uploadUserImage = uploadUserImage;
        this.updateUser = updateUser;
        this.deleteUser = deleteUser;
        this.loginFacebook = loginFacebook;
        this.getFBUser = getFBUser;

        function register(email, password, surname, lastname, type) {
            return $http.post(connection.baseUri + 'signup', {
                email: email,
                password: password,
                surname: surname,
                lastname: lastname,
                type: type
            });
        }

        function updateUser(email, oldPassword, newPassword, surname, lastname, age) {
            return $http.put(connection.baseUri + 'update', {
                email: email,
                oldPassword: oldPassword,
                newPassword: newPassword,
                surname: surname,
                lastname: lastname,
                age: age
            });
        }

        function uploadUserImage(file) {
            return $http.post(connection.baseUri + 'upload', {
                data: file
            });
        }

        function login(email, pass) {
            return $http.post(connection.baseUri + 'login', {
                email: email,
                password: pass
            })
        }

        function loginFacebook() {
            return $window.location.href = connection.baseUri + 'fblogin';
        }

        function getFBUser(id) {
            return $http.post(connection.baseUri + 'fbuser', {
                id: id
            })
        }

        function logout() {
            return auth.deleteToken();
        }

        function deleteUser(id) {
            return $http.post(connection.baseUri + 'unregister', {
                id: id
            })
        }

        function loggedIn() {
            return auth.isAuthed();
        }

        function getUser() {
            var token = auth.getToken();

            if (token) {
                var params = auth.parseJwt(token);
                return params.user;
            } else {
                return false;
            }
        }

    }

})();


(function () {

    angular.module('app')
        .service('TripService', tripService);

    function tripService(connection, $http, auth) {

        this.saveTrip = saveTrip;
        this.getTrips = getTrips;
        this.getTrip = getTrip;
        this.getAllTrips = getAllTrips;
        this.updateTrip = updateTrip;
        this.deleteTrip = deleteTrip;

        function saveTrip(trip, user, title) {
            return $http.post(connection.baseUri + 'saveTrip', {
                trip: trip,
                user: user,
                title: title
            });
        }

        function deleteTrip(_id) {
            return $http.delete(connection.baseUri + 'deleteTrip/' + _id, {
                _id: _id
            });
        }

        function getTrips(email) {

            return $http({
                url: connection.baseUri + 'trip',
                method: "GET",
                params: {email: email}
            });
        }

        function getAllTrips() {

            return $http({
                url: connection.baseUri + 'trips',
                method: "GET"
            });
        }

        function getTrip(id) {

            return $http({
                url: connection.baseUri + 'editTrip',
                method: "GET",
                params: {id: id}
            });
        }

        function updateTrip(tripID, trip) {

            return $http.put(connection.baseUri + 'updateTrip', {
                trip: trip,
                id: tripID
            });
        }
    }

})();

(function () {

    angular.module('app')
        .service('DealService', dealService);

    function dealService(connection, $http) {

        this.saveDeal = saveDeal;
        this.getDeals = getDeals;
        this.getAllDeals = getAllDeals;

        function saveDeal(deal, email) {
            return $http.post(connection.baseUri + 'saveDeal', {
                deal: deal,
                email: email
            });
        }

        function getDeals(email) {

            return $http({
                url: connection.baseUri + 'deal',
                method: "GET",
                params: {email: email}
            });
        }

        function getAllDeals() {
            return $http({
                url: connection.baseUri + 'alldeals',
                method: "GET",
            });
        }
    }



})();