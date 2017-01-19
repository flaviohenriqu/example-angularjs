'use strict';

var app = angular.module('recruiter-system.candidate');

app.controller('CandidateCtrl', ['$scope', 'CandidateDataService',
        'DropdownDataService', 'toastr',
  function($scope, CandidateDataService, DropdownDataService, toastr){
    $scope.model = {
      candidates: [],
      dropdown_values: []
    }

    var dropdowns = ['job_position', 'english_level', 'country'];
    getDropdownValues(dropdowns);

    allCandidates();

    $scope.isNewValue = false;

    $scope.getTemplate = function(candidate) {
      if(candidate.selected) return 'edit';
      else if(candidate.id == '') return 'add';
      else return 'display';
    }

    $scope.editCandidate = function(candidate) {
      candidate.selected = true;
      candidate.rollback = angular.copy(candidate);
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
      } else {
        toastr.error('All fields are required.');
      }
    }

    $scope.updateCandidate = function(candidate) {
      if($scope.candidateForm.$valid){
          var rollback = candidate.rollback;
          //remove optional fields
          delete candidate.rollback;
          delete candidate.selected;
          delete candidate.comments;
          delete candidate.where_found_us;
          CandidateDataService.updateCandidate(candidate).then(
            function(){
              toastr.success('Candidate updated with success.')
              $scope.reset(candidate);
            },
            function(){
              toastr.error('Candidate not updated.');
              candidate = rollback;
            }
          );
      } else {
        toastr.error('All fields are required.');
      }
    }

    $scope.reset = function(candidate) {
      candidate.selected = false;
      $scope.isNewValue = false;
    }

    $scope.resetAdd = function() {
      var idx = $scope.model.candidates.length - 1;
      $scope.model.candidates.splice(idx, 1);
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
