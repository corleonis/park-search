'use strict';

/**
 * @ngdoc overview
 * @name searchTestApp
 * @description
 * # searchTestApp
 *
 * Main module of the application.
 */
var app = angular.module('searchTestApp',
    ['ngAnimate', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch']
);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            //controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.factory('ParkingSpotsFactory', function($http, $q) {
    var spots = [],
        getSpots = function() {
            var deferred = $q.defer();

            $http.get('https://api.justpark.com/1.1/location/?q=wembley')
            .success(function (data) {
                var results = data.data,
                    items = [];

                angular.forEach(results, function (item) {
                    items.push({
                        title: "Parking from: " + item.display_price.formatted_price + " p/d",
                        description: item.title,
                        href: item.href,
                        lat: item.coords.lat,
                        lng: item.coords.lng
                    });
                });

                deferred.resolve(items);
            });

            return deferred.promise;
        };

    return {getSpots: getSpots};
});

app.factory('MapFactory', function() {
    var map,
        getMap = function () {
            if (map === undefined) {
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 16,
                    center: new google.maps.LatLng(51.55585300, -0.27959400),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                });
            }

            return map;
        };

    return {getMap: getMap};
});

app.controller('MapsController', function ($scope, $http, ParkingSpotsFactory, MapFactory) {
    $(document).ready(function () {
        var createMarker,
            infoWindow = new google.maps.InfoWindow();

        $scope.map = MapFactory.getMap();

        $scope.markers = [];
        createMarker = function (info){
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: {lat: info.lat, lng: info.lng},
                title: info.title
            });
            marker.content = '<div class="infoWindowContent">' + info.description + '</div>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        };

        // Method to open marker info box
        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };



        var promise = ParkingSpotsFactory.getSpots();
        promise.then(function(spots) {
            for (var i=0; i < spots.length; i++) {
                createMarker(spots[i]);
            }
        });
    });
});
app.controller('NavigationController', function ($scope, ParkingSpotsFactory, MapFactory) {
    var promise = ParkingSpotsFactory.getSpots(),
    createNavigationItems = function(items) {
        $scope.items = items;
    },
    map = MapFactory.getMap();

    promise.then(function(spots) {
        for (var i=0; i < spots.length; i++) {
            createNavigationItems(spots);
        }
    });

    $scope.focusMap = function (lat, lng) {
        map.setCenter({lat: lat, lng: lng});
        map.setZoom(18);
    }

});