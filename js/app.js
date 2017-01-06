var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.factory('DropdownService', ['$http','$q', '$filter', function($http, $q, $filter){
  var allData;

  var service = {
    allFields: allFields,
    valuesForField: valuesForField,
    addValue: addValue
  }
  return service;

  function valuesForField(fieldName) {
    var result = $filter('filter')(allData, {field_name: fieldName});
    return result;
  }

  function allFields() {
    if(allData){
      return $q.when(allData);
    }

    var request = $http.get('http://localhost:8000/api/v1/dropdowns/?format=json');

    return request.then(function(response){
      allData = response.data;
      return allData;
    });
  }

  function addValue(fieldName, value) {
    var dataObj = {
            field_name: fieldName,
            dropdown_values: [{text: value}],
    }
    var request = $http.post('http://localhost:8000/api/v1/dropdowns/', dataObj);

    return(request.then(handleSuccess, handleError));
  }

  function handleError(response){
    if(!angular.isObject(response.data) || !response.data.message){
      return($q.reject("An unknown error occurred."));
    }
    return($q.reject(response.data.message));
  }

  function handleSuccess(response){
    return(response.data);
  }
}]);

recruiterApp.controller('DropdownController', ['$scope', '$filter', 'DropdownService', function($scope, $filter, DropdownService){
    $scope.DropdownValues = {};
    allFields();

    $scope.submit = function(fieldName, id) {
      console.log('Saving new dropdown value.');
      var value = $scope.DropdownValues[id];
      $scope.DropdownValues[id] = '';

      DropdownService.addValue(fieldName, value)
        .then(
          function(response){
            var obj = $filter('filter')($scope.dropdowns, {field_name: response.field_name});
            var index = $scope.dropdowns.indexOf(obj[0]);
            var newValue = response.dropdown_values[response.dropdown_values.length - 1];
            $scope.dropdowns[index].dropdown_values.push(newValue);
          },
          function(errorMessage){
            console.warn(errorMessage);
          }
        );
    }

    function applyRemoteData(dropdowns){
      $scope.dropdowns = dropdowns;
    }

    function allFields(){
      DropdownService.allFields().then(applyRemoteData);
    }

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

