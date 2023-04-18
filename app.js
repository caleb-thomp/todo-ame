angular
  .module("todoApp", [])
  .controller("TodoController", function ($scope, $http) {
    $http
      .get("http://localhost:3000/api/todos")
      .then(function (response) {
        $scope.todos = response.data;
      });

    $scope.addTodo = function () {
      const todo = {
        text: $scope.todoText,
        done: false,
      };
      $http
        .post("http://localhost:3000/api/todos", todo)
        .then(function (response) {
          $scope.todos.push(response.data);
          $scope.todoText = "";
        });
    };

    $scope.updateTodo = function (todo) {
      const updatedTodo = {
        text: todo.text,
        done: todo.done,
      };
      $http
        .put(
          "http://localhost:3000/api/todos/" + todo._id,
          updatedTodo
        )
        .then(function (response) {
          console.log("Todo updated");
        });
    };

    $scope.remaining = function () {
      var count = 0;
      angular.forEach($scope.todos, function (todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.deleteTodo = function (todo) {
      $http
        .delete(
          "http://localhost:3000/api/todos/" + todo._id
        )
        .then(function (response) {
          const index = $scope.todos.indexOf(todo);
          $scope.todos.splice(index, 1);
        });
    };
  });
