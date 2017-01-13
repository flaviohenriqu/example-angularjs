'use strict';

var app = angular.module('recruiter-system.core');

app.factory('DropdownDataService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig) {
    var allData;
    var dataField;

    var service = {
      allFields: allFields,
      valuesForField: valuesForField,
      addValue: addValue
    }
    return service;

    function valuesForField(fieldName) {
      var result;

      if(dataField){
        return $q.when(dataField);
      }

      var request = $http.get(AppConfig.API_URL + "/dropdowns/" + fieldName + "/?format=json");
      return request.then(function(response) {
        dataField = response.data;
        result = dataField.dropdown_values;
        return result;
      });
    }

    function allFields() {
      if(allData) {
        return $q.when(allData);
      }

      var request = $http.get(AppConfig.API_URL + "/dropdowns/?format=json");

      return request.then(function(response) {
        allData = response.data;
        return allData;
      });
    }

    function addValue(dropdown) {
      var dataObj = {
        field_name: dropdown.field_name,
        dropdown_values: [{text: dropdown.newValue}],
      }
      var request = $http.post(AppConfig.API_URL + "/dropdowns/", dataObj);

      return request.then(function(response){
        var data = response.data;
        var value = data.dropdown_values[data.dropdown_values.length - 1];

        dropdown.dropdown_values.push(value);
        dropdown.newValue = '';
        return dropdown;
      }, handleError);
    }

    function handleError(response) {
      if(!angular.isObject(response.data) || !response.data.dropdown_values) {
        return $q.reject("An unknown error occurred.");
      }
      return $q.reject(response.data.dropdown_values[0].text[0]);
    }

    function handleSuccess(response) {
      return response.data;
    }
  }
]);
