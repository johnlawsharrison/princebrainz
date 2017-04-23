'use strict';

var myApp = angular.module('PrinceApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']);

//configure routes
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})
		.state('suggestion', {
			url: '/suggestion/:category',
			templateUrl: 'partials/suggestion.html',
			controller: 'SuggestCtrl'
		})
		$urlRouterProvider.otherwise('/home');
}]);

// controller for main view
myApp.controller('HomeCtrl', ['$scope', '$http', 'songDataService', function ($scope, $http, songDataService) {
  $scope.categories = Object.keys(_SEARCH_KEYS);
}]);

// controller for the suggestion view
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', 'songDataService', function ($scope, $stateParams, $filter, $http, songDataService) {
	//console.log($stateParams.movie);
	// load in our big json list of AcousticBrainz data
	$scope.category = $stateParams.category;

	if (songDataService.data == null) {
		// reload the data (they probably refreshed)
		$http.get('data/song-data.json').then(function (response) {
			songDataService.data = response.data;
			console.log("finished reloading data: " + songDataService.data.length + " songs");
			// NOTE: probability tuning is really necessary
			$scope.songsInCategory = $filter('filterByCategory')(songDataService.data, $stateParams.category, 0.95);

			$scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
			// $scope.probability = $scope.suggestion.highlevel[_SEARCH_KEYS[$stateParams.category]['key']]['probability'];
		});
	} else {
		$scope.songsInCategory = $filter('filterByCategory')(songDataService.data, $stateParams.category, 0.95);
		$scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
	}

	$scope.randomSong = function () {
		// randomly pick a new suggestion (make sure its different than the current one)
		var song = $scope.suggestion;
		do {
			song = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
		} while (song.metadata.tags.musicbrainz_trackid[0] == $scope.suggestion.metadata.tags.musicbrainz_trackid[0]);
		$scope.suggestion = song;
	};

	$scope.newSong = function (song) {
		$scope.suggestion = song;
	}
}]);


// service for managing access to song data (without reloading all the time)
myApp.factory('songDataService', ['$filter', '$http', function($filter, $http) {
	var service = {}

	// load in our big json list of low-level AcousticBrainz data
	$http.get('data/song-data.json').then(function (response) {
		service.data = response.data;
		console.log("finished loading data: " + service.data.length);
	});

	return service;
}]);


// filter songs by category, with a specified minimum probability of membership
myApp.filter('filterByCategory', function() {
	return function(input, category, minProb) {
		var filtered = [];
		angular.forEach(input, function(item) {
			var data = item.highlevel;
			if (parseFloat(data[_SEARCH_KEYS[category]['key']]['probability']) >= parseFloat(minProb)) {
				filtered.push(item);
			}
		});
		return filtered;
	}
});


myApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
