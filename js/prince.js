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
  $scope.categories = [
  'sad', 'happy', 'aggressive', 'acoustic', 'instrumental',
  'relaxing', 'atonal', 'danceable', 'party', 'dark', 'bright'
  ];

}]);

// controller for the suggestion view
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', 'songDataService', function ($scope, $stateParams, $filter, $http, songDataService) {
	//console.log($stateParams.movie);
	$scope.category = $stateParams.category;

	$scope.songsInCategory = $filter('filterByMood')(songDataService.data, $stateParams.category);
	// pick a random song from this category to suggest
	$scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];

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



	console.log($scope.suggestion.metadata.tags.musicbrainz_trackid);
	console.log($scope.suggestion.rhythm.danceability);

}]);

// service for managing access to song data
myApp.factory('songDataService', ['$filter', '$http', function($filter, $http) {
	var service = {}

	// load in our big json list of low-level AcousticBrainz data
	$http.get('data/song-data.json').then(function (response) {
		service.data = response.data;
		console.log("finished loading data: " + service.data.length);
	});

	return service;
}]);

myApp.filter('filterByMood', function() {
	return function(input, category) {
		var filtered = []
		angular.forEach(input, function(item) {
			if (item.metadata && item.metadata.tags) {
				var moods = item.metadata.tags.mood;
				if (moods && moods.indexOf(category) !== -1) {
					filtered.push(item)
				}
			}
		});
		return filtered;
	}
});

myApp.filter('filterByDanceability', function() {
	return function(input, category) {
		var filtered = []
		angular.forEach(input, function(item) {
			if (item.metadata && item.metadata.tags) {
				var moods = item.metadata.tags.mood;
				if (moods && moods.indexOf(category) !== -1) {
					filtered.push(item)
				}
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
