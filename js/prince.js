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
			templateUrl: 'partials/movie-detail.html',
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
myApp.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  // $scope.ordering = '-gross'; //default ordering
  $scope.categories = [
  'sad', 'happy', 'aggressive', 'acoustic', 'instrumental',
  'relaxing', 'atonal', 'danceable', 'party', 'dark', 'bright'
  ];

  $scope.clickCategory = function(category) {
	console.log('you clicked:' + category);
  }


  // $http.get('data/movies-2015.json').then(function (response) {
		// var data = response.data;
		// $scope.movies = data;
  // });
}]);

//For movie blog
myApp.controller('BlogCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

	$http.get('data/blog.json').then(function (response) {
		$scope.posts = response.data;
 	});

	$scope.postToBlog = function () {
		var title = $scope.newPost.title; //get values from form
		var date = $filter('date')(Date.now(), 'yyyy-MM-ddTHH:mm:ss'); //format current time
		var body = $scope.newPost.body;

    //object that is the new post
		var theNewPost = { 'title': title, 'date': date, 'content': body };

		//TODO: Add new post to the list of posts!
		$scope.posts.push(theNewPost);
	};

}]);

//For movie details
myApp.controller('SuggestCtrl', ['$scope', '$stateParams', '$filter', '$http', 'watchlistService', function ($scope, $stateParams, $filter, $http, watchlistService) {
	//console.log($stateParams.movie);
	$scope.category = $stateParams.category;

 //  $http.get('data/movies-2015.json').then(function (response) {
	// 	var movies = response.data;

	// 	var targetObj = $filter('filter')(movies, { //filter the array
	// 		id: $stateParams.movie //for items whose id property is targetId
	// 	}, true)[0]; //save the 0th result

	// 	$scope.movie = targetObj;

	// 	var omdbUri = 'http://www.omdbapi.com/?t=' + $scope.movie.title;
	// 	return $http.get(omdbUri); //launch request and return promise for later
 //  })
	// .then(function (response) { //on response from OMDB
	// 	//save some omdb specific fields
	// 	$scope.movie.Title = response.data.Title;
	// 	$scope.movie.Year = response.data.Year;
	// 	$scope.movie.imdbID = response.data.imdbID;
	// 	$scope.movie.Poster = response.data.Poster;
	// 	$scope.movie.Plot = response.data.Plot;
	// });

	// $scope.saveMovie = function(movie) {
	// 	watchlistService.addMovie(movie);
	// };
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

myApp.factory('watchlistService', function() {
	var service = {}

	if (localStorage['watchlist'] !== undefined) {
		service.watchlist = JSON.parse(localStorage.watchlist);
	} else {
		service.watchlist = [];
	}

	service.addMovie = function(movie) {
		service.watchlist.push(movie);
		localStorage['watchlist'] = JSON.stringify(service.watchlist);
	};

	return service;
});
