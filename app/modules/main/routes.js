'use strict'

var app = angular.module('recruiter-system.main');

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
    })
    .state('dropdowns', {
      url: '/dropdowns',
      templateUrl: 'modules/dropdown/dropdown.html',
      controller: 'DropdownCtrl',
    })
    .state('candidates', {
      url: '/candidates',
      templateUrl: 'modules/candidate/candidate.html',
      controller: 'CandidateCtrl',
    });
});
