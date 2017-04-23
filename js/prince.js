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
myApp.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.categories = [
  'sad', 'happy', 'aggressive', 'acoustic', 'instrumental', 'electronic',
  'relaxed', 'atonal', 'danceable', 'party', 'dark', 'bright'
  ];

}]);

// controller for the suggestion view
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', function ($scope, $stateParams, $filter, $http) {
	//console.log($stateParams.movie);
	// load in our big json list of AcousticBrainz data
	$scope.category = $stateParams.category;
	$scope.loaded = false;
	$http.get('data/song-data.json').then(function (response) {
		$scope.songData = response.data;
		$scope.loaded = true;
		console.log("finished loading data: " + $scope.songData.length);
		$scope.songsInCategory = $filter('filterByCategory')($scope.songData, $stateParams.category);
		$scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
	});

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

myApp.filter('filterByCategory', function() {
	return function(input, category) {
		var filtered = [];
		angular.forEach(input, function(item) {
			var data = item.highlevel;
			if (data[_SEARCH_KEYS[category]['key']]['value'] === _SEARCH_KEYS[category]['expected']) {
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
