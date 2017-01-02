var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.controller('DropdownController', ['$scope', '$http', function($scope, $http){
    $scope.dropdowns;
    $http.get('http://127.0.0.1:8000/api/v1/dropdowns/?format=json').then(function(response) {
      $scope.dropdowns = response.data;
  });
}]);


recruiterApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    var homeState = {
        name: 'home',
        url: '/home',
        templateUrl: 'partial-home.html'
    }
    var dropState = {
        name: 'dropdowns',
        url: '/dropdowns',
        templateUrl: 'partial-dropdown.html',
        controller: 'DropdownController'
    }

    $stateProvider.state(homeState);
    $stateProvider.state(dropState);
});

