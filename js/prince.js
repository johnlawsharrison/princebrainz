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
		.state('about', {
			url: '/about',
			templateUrl: 'partials/about.html'
		})
		.state('blog', {
			url: '/musings',
			templateUrl: 'partials/blog.html',
			controller: 'BlogCtrl'
		})
		.state('suggestion', {
			url: '/suggestion/:category',
			templateUrl: 'partials/suggestion.html',
			controller: 'SuggestCtrl'
		})
		.state('watchlist', {
			url: '/watchlist',
			templateUrl: 'partials/watchlist.html',
			controller: 'WatchListCtrl'
		})
		$urlRouterProvider.otherwise('/home');
}]);

//For movie list
myApp.controller('HomeCtrl', ['$scope', '$http', 'songDataService', function ($scope, $http, songDataService) {
  // $scope.ordering = '-gross'; //default ordering
  $scope.categories = [
  'sad', 'happy', 'aggressive', 'acoustic', 'instrumental',
  'relaxing', 'atonal', 'danceable', 'party', 'dark', 'bright'
  ];

}]);

// controller for the suggestion view
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', 'songDataService', function ($scope, $stateParams, $filter, $http, songDataService) {
	//console.log($stateParams.movie);
	$scope.category = $stateParams.category;

	// TODO: this only works for tags that are "moods" (happy, sad, aggressive, acoustic, party)
	$scope.songsInCategory = $filter('filterByMood')(songDataService.data, $stateParams.category);
	$scope.suggestion = $scope.songsInCategory[0];

}]);


//For to-watch list
myApp.controller('WatchListCtrl', ['$scope', '$http', '$uibModal', 'watchlistService', function ($scope, $http, $uibModal, watchlistService) {

	//"constants" for priority setting
	$scope.priorities = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
	$scope.priority = 'Medium'; //default

	$scope.watchlist = watchlistService.watchlist;

	//run a search query
	$scope.searchFilms = function () {

		var omdbUri = 'http://www.omdbapi.com/?s=' + $scope.searchQuery + '&type=movie';
		$http.get(omdbUri).then(function (response) {
			$scope.searchResults = response.data.Search;
			//show modal!
			var modalInstance = $uibModal.open({
			   templateUrl: 'partials/select-movie-modal.html', //partial to show
			   controller: 'ModalCtrl', //controller for the modal
			   scope: $scope //pass in all our scope variables!
			});

			//When the modal closes (with a result)
			modalInstance.result.then(function(selectedItem) {
			   $scope.movie = selectedItem;
			   console.log('selected: ' + $scope.movie);
			});
		});
	};

	//save a selected film to the watchlist
	$scope.saveFilm = function (movie, priority) {
		watchlistService.addMovie(movie);
		$scope.movie = undefined; //clear the selected movie
	};
}]);

myApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
	$scope.select = function (movie) {
		$scope.selectedMovie = movie;
	};

	//function to call when OK button pressed
	$scope.ok = function () {
		$uibModalInstance.close($scope.selectedMovie);
	};

	//function to call when cancel button pressed
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

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

myApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
