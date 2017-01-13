'use strict';

var app = angular.module('recruiter-system.dropdown');

app.controller('DropdownCtrl', ['$scope', 'DropdownDataService', 'toastr',
  function($scope, DropdownDataService, toastr){
    allFields();
    $scope.isSaving = false;

    $scope.submit = function(dropdown) {
      $scope.isSaving = true;
      DropdownDataService.addValue(dropdown)
        .then(
          function(response) {
            dropdown = response;
            toastr.success('Added with success.');
          },
          function(errorMessage) {
            console.warn(errorMessage);
            toastr.error(errorMessage);
          }
        ).finally(function() {
          $scope.isSaving = false;
        });
    }

    function applyRemoteData(dropdowns) {
      $scope.dropdowns = dropdowns;
    }

    function allFields() {
      DropdownDataService.allFields().then(applyRemoteData);
    }
  }]);
