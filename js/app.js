var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partial-home.html'
      })
      .state('dropdowns', {
        // add dropdown page
      })
      .state('candidates', {})
      .state('tags', {});
});
