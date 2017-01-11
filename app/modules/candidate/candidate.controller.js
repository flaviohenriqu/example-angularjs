'use strict';

var app = angular.module('recruiter-system.candidate');

app.controller('CandidateCtrl', ['$scope', 'CandidateDataService', 'DropdownDataService',
  function($scope, CandidateDataService, DropdownDataService){
    $scope.model = {
      candidates: [],
      selected: {},
      dropdown_values: []
    }

    allCandidates();

    $scope.getTemplate = function(candidate) {
      if(candidate.id === $scope.model.selected.id) return 'edit';
      else if(candidate.id == '') return 'add';
      else return 'display';
    }

    $scope.editCandidate = function(candidate) {
      $scope.model.selected = angular.copy(candidate);
    }

    $scope.addNew = function() {
      $scope.model.candidates.push({id: '', name: '', job_position: '', email: '', country: '', english_level: ''});
    }

    $scope.saveCandidate = function(idx, candidate) {
      CandidateDataService.addCandidate(candidate).then(
        function(response){
          $scope.model.candidates[idx] = response;
        }
      );
    }
    $scope.updateCandidate = function(idx) {
      CandidateDataService.updateCandidate($scope.model.selected).then(
        function(){
          $scope.model.candidates[idx] = angular.copy($scope.model.selected);
          $scope.reset();
        }
      );
    }

    $scope.reset = function() {
      $scope.model.selected = {};
    }

    function applyRemoteData(candidates) {
      $scope.model.candidates = candidates;
    }

    function allCandidates() {
      CandidateDataService.allCandidates().then(applyRemoteData);
    }

    $scope.getDropdownValues = function(field_name) {
      DropdownDataService.valuesForField(field_name).then(function(response){
        $scope.model.dropdown_values[field_name] = response;
      });
    }
  }
]);
