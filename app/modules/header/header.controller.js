'use strict';

var app = angular.module('recruiter-system.header');

app.controller("HeaderCtrl",['$scope', '$state', function($scope, $state) {
  $scope.isActiveState = function (stateName) {
    return $state.includes(stateName);
  }
}]);
