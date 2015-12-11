'use strict';

var app = angular.module('paymentApp', ['ui.router', 'ngStorage', 'stripe.checkout']);

app.constant('ENV', {
  API_URL: 'http://localhost:3000'
});

app.run(function($rootScope, $localStorage) {
  $rootScope.$storage = $localStorage;
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', { url: '/', templateUrl: 'templates/home.html'})
    .state('login', { url: '/login', templateUrl: 'templates/login.html', controller: 'loginCtrl'})
    .state('register', { url: '/register', templateUrl: 'templates/register.html', controller: 'registerCtrl'})

    .state('books', { url: '/books', templateUrl: 'templates/books/layout.html', abstract: true })
    .state('books.index', { url: '/', templateUrl: 'templates/books/booksIndex.html', controller: 'booksIndexCtrl'})
    .state('books.show', { url: '/{bookId}', templateUrl: 'templates/books/booksShow.html', controller: 'booksShowCtrl'})
    .state('shoppingcart', { url: '/shoppingcart', templateUrl: 'templates/shoppingcart.html', controller: 'shoppingcartCtrl'})
});











'use strict';

var app = angular.module('paymentApp');

app.controller('loginCtrl', function($scope, $state, $localStorage, UserService) {
  $scope.submit = function(user) {
    UserService.login(user)
    .then(function(res){
      $scope.$storage.myToken = res.data.token;
      $scope.$storage.id = res.data.id;

      $state.go('home');
    }, function(err) {
      console.error(err);

    }); 
  }
});

'use strict';

var app = angular.module('paymentApp');

app.controller('navCtrl', function($scope, $state) {
  $scope.logout = function(){
    delete $scope.$storage.myToken;
    $state.go('home');
  };
});

'use strict';

var app = angular.module('paymentApp');

app.controller('registerCtrl', function($scope, $state, UserService) {

  $scope.submit = function(user) {
    if(user.password !== user.password2){
      swal('Error:', 'Passwords do not match.', 'error');
      return;
    }
    UserService.register(user)
    .then(function(data){
      $scope.$storage.myToken = data.token;
      $state.go('home');

    }, function(err) {
      console.error(err);
    });
  }
});

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
'use strict';

var app = angular.module('paymentApp');

app.service('BookService', function($http, ENV) {
  this.index = function() {
    return $http.get(`${ENV.API_URL}/books/`);
  };
  this.show = function(bookId) {
    return $http.get(`${ENV.API_URL}/books/${bookId}`);
  };
});

'use strict';

var app = angular.module('paymentApp');

app.service('UserService', function($http, ENV) {
  this.register = function(user) {
    return $http.post(`${ENV.API_URL}/users/register`, user);
  };
  this.login = function(user) {
    return $http.post(`${ENV.API_URL}/users/login`, user);
  };
});

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

'use strict';

var app = angular.module('paymentApp');

app.controller('booksShowCtrl', function($scope, $state, $http, ENV, BookService) {
  BookService.show($state.params.bookId)
  .then(function(res) {
    $scope.book = res.data;
  });

  $scope.doCheckout = function(tokenObj) {
    $http.post(`${ENV.API_URL}/checkout`, {
      tokenObj: tokenObj,
      book: $scope.book
    })
    .then(function(res) {
      console.log('res:', res);
    }, function(err) {
      console.log('err:', err);
    })
    console.log('token:', tokenObj);
  };


});




