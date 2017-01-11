'use strict';

var app = angular.module('recruiter-system.dropdown');

app.controller('DropdownCtrl', ['$scope', 'DropdownDataService',
  function($scope, DropdownDataService){
    allFields();

    $scope.submit = function(dropdown) {
      DropdownDataService.addValue(dropdown.field_name, dropdown.newValue)
        .then(
          function(response) {
            var value = response.dropdown_values[response.dropdown_values.length - 1];
            dropdown.dropdown_values.push(value);
            dropdown.newValue = '';
          },
          function(errorMessage) {
            concole.warn(errorMessage);
          }
        );
    }

    function applyRemoteData(dropdowns) {
      $scope.dropdowns = dropdowns;
    }

    function allFields() {
      DropdownDataService.allFields().then(applyRemoteData);
    }
  }]);
