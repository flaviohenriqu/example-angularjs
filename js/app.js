var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.factory('DropdownService', ['$http','$q', '$filter', '$cacheFactory', function($http, $q, $filter, $cacheFactory){
  var values;
  var service = {
    allFields: allFields,
    valuesForField: valuesForField,
    addValue: addValue
  }
  return service;

  function valuesForField(fieldName) {
    var result = $filter('filter')(values, {field_name: fieldName});
    console.log(result);
    return result;
  }

  function allFields() {
    var dropCache = $cacheFactory.get('dropCache');
    return($http.get('http://localhost:8000/api/v1/dropdowns/?format=json', {cache: dropCache}).then(handleSuccess, handleError));
  }

  function addValue(fieldName, value) {
    var dataObj = {
            field_name: fieldName,
            dropdown_values: [{text: value}],
    }
    return($http.post('http://localhost:8000/api/v1/dropdowns/', dataObj).then(handleSuccess, handleError))
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

recruiterApp.controller('DropdownController', ['$scope', 'DropdownService', function($scope, DropdownService){
    $scope.dropdowns;

    allFields();

    $scope.submit = function(fieldName, id) {
      console.log('Saving new dropdown value.');
      var value = angular.element('#field_'+id).val();
      DropdownService.addValue(fieldName, value)
        .then(
            allFields(),
            function(errorMessage){
              console.warn(errorMessage);
            }
            );
    }

    $scope.valuesForField = function(fieldName) {
      DropdownService.valuesForField(fieldName);
    }

    function applyRemoteData(dropdowns){
      $scope.dropdowns = dropdowns;
    }

    function allFields(){
      DropdownService.allFields()
        .then(
              function(values){
                applyRemoteData(values);
              }
            );
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

