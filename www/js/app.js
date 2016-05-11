// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.html",
          controller: 'AppCtrl'
      })
      .state('app.opencall', {
          url: "/opencall",
          views: {
              'menuContent': {
                  templateUrl: "templates/opencall.html",
                  controller: 'opencallCtrl'
              }
          },

      })
         .state('app.signout', {
             url: "/signout",
             views: {
                 'menuContent': {
                     templateUrl: "templates/login.html",
                     controller: 'LoginCtrl'
                 }
             }
         })
         .state('app.updatecall', {
             url: "/updatecall/:callistId",
             views: {
                 'menuContent': {
                     templateUrl: "templates/updatecall.html",
                     controller: 'updatecallCtrl'

                 }
             },

         })
         .state('app.newcall', {
             url: "/newcall",
             views: {
                 'menuContent': {
                     templateUrl: "templates/newcall.html",
                     controller: 'newcallCtrl'

                 }
             }
         })




      .state('login', {
          url: "/login",
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
      });






    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

})




.controller('AppCtrl', function ($scope, $state) {
    $scope.Pageredirect = function (value) {

        if (value == "logout") {
            $state.go('login');
        }
        else if (value == 'call') {
            $state.go('app.opencall');
        }

    }
})

.controller('opencallCtrl', function ($scope, $state) {

    $scope.calllists = [

      { isDivider: true, divider: "Department A" },
      { name: 'Welder Machine', id: 1, details: 'Opened at 10/04/2016 15:30',downtime:'false' },
      { name: 'Press Machine', id: 2, details: 'Opened at 10/04/2016 18:30',downtime:'true' },
        { name: 'Labeler', id: 3, details: 'Opened at 11/04/2016 15:30' ,downtime:'false'},
       { isDivider: true, divider: "Department B" },

      { name: 'Bag Machine', id: 4, details: 'Opened at 12/04/2016 15:30',downtime:'true' },
      { name: 'Momuta', id: 5, details: 'Opened at 13/04/2016 15:30',downtime:'false'},

    ];

    $scope.AddCall = function (value) {
        $state.go('app.newcall');
    }


})

 .controller('updatecallCtrl', function ($scope, $stateParams) {

     $scope.name = 'Fault 1234';



 })
 .controller('newcallCtrl', function ($http,$scope, $stateParams) {


 })

.controller('LoginCtrl', function ($scope, $state) {

    $scope.LogIn = function (user) {

        $state.go('app.opencall');
    };

})
.directive('dividerCollectionRepeat', function ($parse) {
    return {
        priority: 1001,
        compile: compile
    };

    function compile(element, attr) {

        var height = attr.itemHeight || '73';
        attr.$set('itemHeight', 'callist.isDivider ? 37 : ' + height);

        element.children().attr('ng-hide', 'callist.isDivider');
        element.prepend(
            '<div class="item item-divider ng-hide" ng-show="callist.isDivider" ng-bind="callist.divider"></div>'
        );
    }
})
