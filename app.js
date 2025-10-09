var app = angular.module("studentApp", []);

app.controller("StudentController", function($scope, $http) {
  $scope.students = [];
  $scope.student = {};
  $scope.editMode = false;

  const apiUrl = "http://localhost:5000/student";

  $scope.loadStudents = function() {
    $http.get("http://localhost:5000/students")
      .then(response => { $scope.students = response.data; })
      .catch(err => console.error(err));
  };

  $scope.addStudent = function() {
    $http.post(apiUrl, $scope.student)
      .then(response => {
        alert(response.data.message);
        $scope.loadStudents();
        $scope.resetForm();
      })
      .catch(err => alert(err.data.error));
  };

  $scope.editStudent = function(s) {
    $scope.student = angular.copy(s);
    $scope.editMode = true;
  };

  $scope.updateStudent = function() {
    $http.put(apiUrl + "/" + $scope.student.registerNo, $scope.student)
      .then(response => {
        alert(response.data.message);
        $scope.loadStudents();
        $scope.resetForm();
      })
      .catch(err => alert(err.data.error));
  };
  $scope.deleteStudent = function(regNo) {
    if (confirm("Are you sure you want to delete this student?")) {
      $http.delete(apiUrl + "/" + regNo)
        .then(response => {
          alert(response.data.message);
          $scope.loadStudents();
        })
        .catch(err => alert(err.data.error));
    }
  };

  $scope.resetForm = function() {
    $scope.student = {};
    $scope.editMode = false;
  };

  $scope.loadStudents();
});
