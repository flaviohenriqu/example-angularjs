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

    $scope.getTemplate = function(candidate) {
      if(candidate.selected) return 'edit';
      else if(candidate.id == '') return 'add';
      else return 'display';
    }

    $scope.editCandidate = function(candidate) {
      candidate.rollback = angular.copy(candidate);
      candidate.selected = true;
    }

    $scope.addNew = function() {
      $scope.isNewValue = true;
      $scope.model.candidates.push({id: '', name: '', job_position: '', email: '', country: '', english_level: ''});
    }

    $scope.saveCandidate = function(idx, candidate) {
      if(validateCandidate(candidate)){
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

    $scope.updateCandidate = function(idx, candidate) {
      if(validateCandidate(candidate)){
          var rollback = candidate.rollback;
          //remove optional fields
          delete candidate.rollback;
          delete candidate.selected;
          delete candidate.comments;
          delete candidate.where_found_us;
          CandidateDataService.updateCandidate(candidate).then(
            function(){
              toastr.success('Candidate updated with success.')
              $scope.reset(idx, candidate);
            },
            function(){
              toastr.error('Candidate not updated.');
              $scope.model.candidates[idx] = rollback;
            }
          );
      }
    }

    $scope.reset = function(idx, candidate) {
      candidate.selected = false;
      if('rollback' in candidate) {
        $scope.model.candidates[idx] = candidate.rollback;
      }
    }

    $scope.resetAdd = function() {
      var idx = $scope.model.candidates.length - 1;
      $scope.model.candidates.splice(idx, 1);
      $scope.isNewValue = false;
    }

    function validateCandidate(candidate){
      var field = [];
      if(!candidate.name){
        field.push('Name');
      }
      if(!candidate.email) {
        field.push('Email');
      }
      if(!candidate.job_position) {
        field.push('Job Position');
      }
      if(!candidate.country) {
        field.push('Country');
      }
      if(!candidate.english_level) {
        field.push('English Level');
      }

      if(field.length) {
        var msg = '';
        angular.forEach(field, function(value){
            msg = value + " is required.\n"
            toastr.warning(msg, 'Warning');
        });
        return false;
      }
      return true;
    }

    function checkAdd() {
      var idx = $scope.model.candidates.length - 1;
      if(!$scope.model.candidates[idx].id) {
        $scope.isNewValue = true;
      }
    }

    function applyRemoteData(candidates) {
      $scope.model.candidates = candidates;
    }

    function allCandidates() {
      CandidateDataService.allCandidates().then(applyRemoteData).finally(
      function(){
        checkAdd();
      });
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
