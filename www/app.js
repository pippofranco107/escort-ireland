angular


.module('EscortIreland', [
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
])


.service('ListService', function ($http, $rootScope, $window) {
  var escorts = Object.create(null);

  var fetch = function (id) {
    return $.get('https://www.escort-ireland.com/escorts/' + id + '-----escort.html').then(function (response) {
      var data = $(response).filter('div#master');
      var escort;
      if (data.find('header.profile div.innertube div.contact.cf a.phone').length) {
        escort = {
          id: id,
          touring: true,
          name: data.find('header.profile div.innertube div.tour.cf h1.name').text(),
          picture: data.find('section.scrolling-images ul li img').first().attr('src'),
          location: $(data.find('header.profile div.innertube div.tour.cf span.meta')[0]).text(),
          dates: $(data.find('header.profile div.innertube div.tour.cf span.meta')[1]).text(),
          phoneNumber: data.find('header.profile div.innertube div.contact.cf a.phone').text(),
        };
      } else {
        escort = {
          id: id,
          touring: false,
          name: data.find('div.profile-reviews-only div.innertube div.header.cf div.profile div.summary.cf div.name h1').text(),
          picture: data.find('div.profile-reviews-only div.innertube div.header.cf div.profile div.summary.cf div.name div.image img').attr('src'),
        };
      }
      $rootScope.$apply(function () {
        escorts[id] = escort;
      });
    });
  };

  this.get = function (id) {
    return escorts[id];
  };

  this.getAll = function () {
    return Object.keys(escorts).map(function (id) {
      return escorts[id];
    });
  };

  this.add = function (id) {
    $window.localStorage[id] = true;
    fetch(id);
    return this;
  };

  this.remove = function (id) {
    delete $window.localStorage[id];
    delete escorts[id];
    return this;
  };

  Object.keys($window.localStorage).forEach(function (id) {
    fetch(id);
  });

})


.controller('EscortListController', function ($scope, ListService) {
  $scope.list = function () {
    return ListService.getAll();
  };
})


.controller('EscortController', function ($scope, $location, ListService) {
  $scope.show = function (id) {
    var escort = ListService.get(id);
    if (escort.touring) {
      $location.url('/escort/' + id);
    }
  };
})


.controller('RemoveEscortController', function ($scope, $mdDialog, ListService) {
  $scope.remove = function (event, id) {
    var escort = ListService.get(id);
    var dialog = $mdDialog.confirm()
      .title('Do you want to delete ' + escort.name + '?')
      .textContent('If you want to add them back, their ID is ' + id + '.')
      .targetEvent(event)
      .ok('Remove')
      .cancel('Cancel');
    $mdDialog.show(dialog).then(function () {
      ListService.remove(id);
    });
  };
})


.controller('AddEscortController', function ($scope, $mdDialog, ListService) {
  $scope.addDialog = function (event) {
    var dialog = $mdDialog.prompt()
      .textContent('Escort ID')
      .placeholder('e.g. emma-butt')
      .targetEvent(event)
      .ok('OK')
      .cancel('Cancel');
    $mdDialog.show(dialog).then(function (id) {
      ListService.add(id);
    });
  };
})


.controller('BackToListController', function ($scope, $window) {
  $scope.back = function () {
    $window.history.back();
  };
})


.controller('EscortDetailsController', function ($scope, $routeParams, ListService) {
  $scope.escort = ListService.get($routeParams.id);
})


.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'list.html',
    })
    .when('/escort/:id', {
      templateUrl: 'escort.html',
    });
})
