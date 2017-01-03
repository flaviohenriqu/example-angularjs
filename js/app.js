var recruiterApp = angular.module('recruiterApp', ['ui.router']);

recruiterApp.factory('DropdownService', ['$http', function($http){
  var service = {
    allFields: allFields,
    valuesForField: valuesForField,
    addValue: addValue
  }
  return service;

  function allFields() {
      return $http.get('http://localhost:8000/api/v1/dropdowns/?format=json');
  }

  function valuesForField(fieldName) {
    //
  }

  function addValue(fieldName, value) {
    var dataObj = {
            field_name: fieldName,
            dropdown_values: [{text: value}],
    }
    return $http.post('http://localhost:8000/api/v1/dropdowns/', dataObj)
  }
}]);

recruiterApp.controller('DropdownController', ['$scope', 'DropdownService', function($scope, DropdownService){
    var self = this;
    $scope.dropdowns;

    self.allFields = function(){
      DropdownService.allFields().then(function(response){
        $scope.dropdowns = response.data;
      });
    }
    self.allFields();

    $scope.submit = function(fieldName, id) {
      console.log('Saving new dropdown value.');
      var value = angular.element('#field_'+id).val();
      DropdownService.addValue(fieldName, value).then(self.allFields());
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

