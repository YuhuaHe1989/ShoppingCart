'use strict';

var app = angular.module('paymentApp');

app.controller('booksIndexCtrl', function($scope, $state, $http, BookService) {
  BookService.index()
  .then(function(res) {
    $scope.books = res.data;
  }, function(err) {
    console.error(err);
  });

  $scope.addToCart = function(book) {
    console.log(book);
    console.log($scope.$storage.id);
    swal("Contratulations!", "Book is Added into your cart!", "success");
    var addBook = {
      book: book,
      id: $scope.$storage.id
    }
    $http.put('/users/addtocart', addBook)
    .then(function(res) {
      console.log('added');
    })
  }

});
