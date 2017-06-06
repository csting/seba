(function () {
    'use strict';

//socket factory that provides the socket service
    angular.module('app').factory('Socket', ['socketFactory',
        function (socketFactory) {
            return socketFactory({
                prefix: '',
                ioSocket: io.connect('http://localhost:3001')
            });
        }
    ]);

})();