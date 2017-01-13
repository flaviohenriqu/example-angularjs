'use strict';

var app = angular.module('recruiter-system.core');

app.factory('CandidateDataService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
    var allData;

    var service = {
      allCandidates: allCandidates,
      addCandidate: addCandidate,
      updateCandidate: updateCandidate
    }
    return service;

    function allCandidates(){
      if(allData){
        $q.when(allData);
      }

      var request = $http.get(AppConfig.API_URL + "/candidates/?format=json");

      return request.then(function(response) {
        allData = response.data;
        return allData;
      });
    }

    function addCandidate(candidate) {
      var data = {
        name: candidate.name,
        email: candidate.email,
        job_position: candidate.job_position,
        country: candidate.country,
        english_level: candidate.english_level
      }
      var request = $http.post(AppConfig.API_URL + "/candidates/", data);

      return request.then(handleSuccess, handleError);
    }

    function updateCandidate(candidate) {
      var request = $http.put(AppConfig.API_URL + "/candidates/" + candidate.id + "/", candidate);

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
  }]);
