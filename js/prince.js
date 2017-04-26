'use strict';

var myApp = angular.module('PrinceApp', ['ui.router', 'ngAudio', 'ngMaterial', 'slickCarousel']).config(
	function($mdThemingProvider) {
		// color themes for angular material
		$mdThemingProvider.theme('default').primaryPalette('deep-purple').accentPalette('purple');
});


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

// return to home on refresh
myApp.controller('TopController', ['$scope', '$location', function($scope, $location) {
	$location.path("/home")
}]);

// controller for main view
myApp.controller('HomeCtrl', ['$scope', '$http', 'songDataService', function ($scope, songDataService) {
	$scope.categories = Object.keys(_SEARCH_KEYS);
}]);

// controller for nav
myApp.controller('NavCtrl', ['$scope', '$http', 'audioService', 'songDataService', function ($scope, audioService, songDataService) {
	$scope.categories = Object.keys(_SEARCH_KEYS);

	$scope.currentSong = audioService;
}]);

// controller for the suggestion view
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', 'audioService', 'songDataService', function ($scope, $stateParams, $filter, $http, audioService, songDataService) {
	$scope.category = $stateParams.category;

	if (songDataService.data == null) {
		// reload the data (they probably refreshed)
		$http.get('data/song-data.json').then(function (response) {
			songDataService.data = response.data;
			console.log("finished reloading data: " + songDataService.data.length + " songs");

			$scope.songsInCategory = $filter('shuffle')($filter('filterByCategory')(songDataService.data, $stateParams.category));

			// $scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
			// $scope.audio = ngAudio.load('sounds/' + $scope.suggestion.metadata.tags.musicbrainz_releasetrackid[0] + '.flac');
			
			// $scope.probability = $scope.suggestion.highlevel[_SEARCH_KEYS[$stateParams.category]['key']]['probability'];
		});
	} else {
		$scope.songsInCategory = $filter('shuffle')($filter('filterByCategory')(songDataService.data, $stateParams.category));
		// $scope.suggestion = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
	}

	// $scope.randomSong = function () {
	// 	// randomly pick a new suggestion (make sure its different than the current one)
	// 	var song = $scope.suggestion;
	// 	do {
	// 		song = $scope.songsInCategory[Math.floor(Math.random()*$scope.songsInCategory.length)];
	// 	} while (song.metadata.tags.musicbrainz_trackid[0] == $scope.suggestion.metadata.tags.musicbrainz_trackid[0]);
	// 	$scope.suggestion = song;
	// 	// $scope.audio = ngAudio.load('sounds/' + $scope.suggestion.metadata.tags.musicbrainz_releasetrackid[0] + '.flac');
	// };

	$scope.playNewSong = function(song) {
		audioService.playNewSong(song);
		$scope.currentAudio = audioService.currentAudio;
	};
}]);


// service for managing access to song data (without reloading all the time)
myApp.factory('songDataService', ['$filter', '$http', function($filter, $http) {
	var service = {};

	// load in our big json list of low-level AcousticBrainz data
	$http.get('data/song-data.json').then(function (response) {
		service.data = response.data;
		console.log("finished loading data: " + service.data.length);
	});

	return service;
}]);

// wrapper service for managing audio playback across multiple views/songs
myApp.factory('audioService', ['ngAudio', function(ngAudio) {
	var service = {
		currentAudio: null,
		title: "",
		album: ""
	};
	service.playNewSong = function(song) {
		if (service.currentAudio != null) {
			// something is loaded already, stop it before we reload
			service.currentAudio.stop();
		}
		// allow audio to continue playing across views
		ngAudio.setUnlock(false)
		service.currentAudio = ngAudio.load('sounds/' + song.metadata.tags.musicbrainz_releasetrackid[0] + '.flac');
		service.currentAudio.title = song.metadata.tags.title[0];
		service.currentAudio.album = song.metadata.tags.album[0];
		service.currentAudio.play();
		console.log("Now playing: " + service.title + " from " + service.album);
	}

	return service;
}]);


// filter songs by category, with a specified minimum probability of membership
myApp.filter('filterByCategory', function() {
	return function(input, category) {
		var minProb = _SEARCH_KEYS[category]['minProb'];
		var filtered = [];
		angular.forEach(input, function(item) {
			var data = item.highlevel[_SEARCH_KEYS[category]['key']]
			// console.log(data['value'] + ": " + data['probability']);
			if (data['value'] === _SEARCH_KEYS[category]['expected'] && parseFloat(data['probability']) >= parseFloat(minProb)) {
				// console.log("found one: " + data['probability']);
				filtered.push(item);
			}
		});
		return filtered;
	}
});

// shuffle function for song lists
myApp.filter('shuffle', function() {
	// -> Fisher–Yates shuffle algorithm
	return function(array) {
  		var m = array.length, t, i;
		// While there remain elements to shuffle
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
  		return array;
	}
});

// simple capitalization filter for formatting
myApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
