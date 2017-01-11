'use strict';

var app = angular.module('recruiter-system.core');

app.factory('DropdownDataService', ['$http', '$q', '$filter', 'AppConfig',
  function($http, $q, $filter, AppConfig) {
    var allData;

    var service = {
      allFields: allFields,
      valuesForField: valuesForField,
      addValue: addValue
    }
    return service;

    function valuesForField(fieldName) {
      var result;

      if(allData){
        result = $filter('filter')(allData, {field_name: fieldName});
        return result.dropdown_values;
      }

      var request = $http.get(AppConfig.API_URL + "/dropdowns/" + fieldName + "/?format=json");
      return request.then(function(response) {
        result = response.data.dropdown_values;
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

    function addValue(fieldName, value) {
      var dataObj = {
        field_name: fieldName,
        dropdown_values: [{text: value}],
      }
      var request = $http.post(AppConfig.API_URL + "/dropdowns/", dataObj);

      return request.then(handleSuccess, handleError);
    }

    function handleError(response) {
      if(!angular.isObject(response.data) || !response.data.message) {
        return $q.reject("An unknown error occurred.");
      }
      return $q.reject(response.data.message);
    }

    function handleSuccess(response) {
      return response.data;
    }
  }
]);
