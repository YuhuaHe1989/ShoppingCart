'use strict';

var app = angular.module('paymentApp');

app.controller('shoppingcartCtrl', function($scope, $state, $http, $localStorage, UserService, ENV) {
  $http.get('/users/cart/' + $scope.$storage.id)
  .then(function(res) {
    $scope.cartItems = res.data.cart;

    $scope.checkoutPrice = 0;
    $scope.cartItems.forEach(function(item) {
      $scope.checkoutPrice += item.price;
    });
  });

  $scope.doCheckout = function(tokenObj) {
    $http.post(`${ENV.API_URL}/checkout`, {
      tokenObj: tokenObj,
      totalprice: $scope.checkoutPrice
    })
    .then(function(res) {
      console.log('res:', res);
      swal("Contratulations!", "Your order is Processed!", "success");
    }, function(err) {
      console.log('err:', err);
    })
    console.log('token:', tokenObj);
  };

});