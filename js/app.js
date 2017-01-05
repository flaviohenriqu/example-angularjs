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
    allData = null;

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

recruiterApp.controller('DropdownController', ['$scope', '$state', 'DropdownService', function($scope, $state, DropdownService){
    $scope.dropdowns;

    allFields();

    $scope.submit = function(fieldName, id) {
      console.log('Saving new dropdown value.');
      var elem = angular.element('#field_'+id);
      var value = elem.val();

      DropdownService.addValue(fieldName, value)
        .then(
          function(){
            $state.go($state.current, {}, {reload: true});
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

