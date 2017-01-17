'use strict';

var app = angular.module('recruiter-system.candidate');

app.controller('CandidateCtrl', ['$scope', 'CandidateDataService',
        'DropdownDataService', 'toastr',
  function($scope, CandidateDataService, DropdownDataService, toastr){
    $scope.model = {
      candidates: [],
      selected: {},
      dropdown_values: []
    }

    var dropdowns = ['job_position', 'english_level', 'country'];
    getDropdownValues(dropdowns);

    allCandidates();

    $scope.isNewValue = false;

    $scope.getTemplate = function(candidate) {
      if(candidate.id === $scope.model.selected.id) return 'edit';
      else if(candidate.id == '') return 'add';
      else return 'display';
    }

    $scope.editCandidate = function(candidate) {
      $scope.model.selected = angular.copy(candidate);
      $scope.isNewValue = true;
    }

    $scope.addNew = function() {
      $scope.isNewValue = true;
      $scope.model.candidates.push({id: '', name: '', job_position: '', email: '', country: '', english_level: ''});
    }

    $scope.saveCandidate = function(idx, candidate) {
      if($scope.candidateForm.$valid){
          CandidateDataService.addCandidate(candidate).then(
            function(response){
              $scope.model.candidates[idx] = response;
              toastr.success('New Candidate added with success.');
            }
          ).finally(function() {
            $scope.isNewValue = false;
          });
      }
    }

    $scope.updateCandidate = function(idx) {
      if($scope.candidateForm.$valid){
          CandidateDataService.updateCandidate($scope.model.selected).then(
            function(){
              toastr.success('Candidate updated with success.')
              $scope.model.candidates[idx] = angular.copy($scope.model.selected);
              $scope.reset();
            }
          );
      }
    }

    $scope.reset = function() {
      $scope.model.selected = {};
      $scope.isNewValue = false;
    }

    function applyRemoteData(candidates) {
      $scope.model.candidates = candidates;
    }

    function allCandidates() {
      CandidateDataService.allCandidates().then(applyRemoteData);
    }

    function getDropdownValues(dropdowns) {
        angular.forEach(dropdowns, function(field_name){
            DropdownDataService.valuesForField(field_name).then(function(response){
              $scope.model.dropdown_values[field_name] = response;
            });
        });
    }
  }
]);
