var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.factory('DropdownService', ['$http','$q', '$filter', '$cacheFactory', function($http, $q, $filter, $cacheFactory){
  var values;
  var dropdownCache = $cacheFactory('dropdownCache');

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
    return($http.get('http://localhost:8000/api/v1/dropdowns/?format=json', {cache: true}).then(handleSuccess, handleError));
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

recruiterApp.controller('DropdownController', ['$scope', '$cacheFactory', 'DropdownService', function($scope, $cacheFactory, DropdownService){
    $scope.dropdowns;

    var cache = $cacheFactory.get('dropdownCache');
    var data = cache.get('dropdownValues');

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
      if(!data){
        DropdownService.allFields()
          .then(
                function(values){
                  cache.put('dropdownValues', values);
                  applyRemoteData(values);
                }
              );
      } else {
        applyRemoteData(data);
      }
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

