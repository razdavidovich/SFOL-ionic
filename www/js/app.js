// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngMessages'])

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
             cache: false,
             url: "/newcall",
             views: {
                 'menuContent': {
                     templateUrl: "templates/newcall.html",
                     controller: 'newcallCtrl'

                 }
             }
         })




      .state('login', {
          cache: false,
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
            localStorage.clear();
            $state.go('login');
        }
        else if (value == 'call') {
            $state.go('app.opencall');
        }

    }
})

.controller('opencallCtrl', function ($scope, $state,$http) {
    //variable initialization
     var indexedTeams=[];
     $scope.calllists='';
     $scope.UserId=window.localStorage.getItem("UserId"); //get the login userid
     //initalize the service url
     const BASE_URL_VALUE = "http://192.168.0.137/LH_Mobile_Backend"
     if($scope.UserId ==undefined || $scope.UserId =="" || $scope.UserId == null)
     {
       $state.go('login');
     }

    $scope.AddCall = function (value) {
        $state.go('app.newcall');
    }

    $scope.bindcalls=function()
    {

         $http.get(BASE_URL_VALUE+'/faults/'+$scope.UserId).success(function (data) {
         indexedTeams=[];
          //assigning  falutlist
          $scope.calllists=data;
          }).error(function (data)
         {
          console.log('calls'+data);
         });
    }
    //call binding
    $scope.bindcalls();

    $scope.filterDepartment = function(callist) {
        var teamIsNew = indexedTeams.indexOf(callist.departmentid) == -1;
        if (teamIsNew) {
          indexedTeams.push(callist);
        }
        return teamIsNew;
      }

})

 .controller('updatecallCtrl', function ($scope, $stateParams,$http,$state,$ionicPopup) {
    //variable initalize
    $scope.FaultID=$state.params.callistId;
    $scope.updatecall = {
      FaultID:0,
      OwnerLoginID:0,
      Comments:'',
      FaultStatusID:0
    };
       //initalize the service url
    const BASE_URL_VALUE = "http://192.168.0.137/LH_Mobile_Backend"
     $scope.ownerlist='';
     $scope.statuslist='';
     $scope.UserId=window.localStorage.getItem("UserId"); //get the login userid
     if($scope.UserId ==undefined || $scope.UserId =="" || $scope.UserId == null)
     {
       $state.go('login');
     }
     //bind owner
     $scope.bindowner=function()
     {

       $http.get(BASE_URL_VALUE+'/lists/2/1').success(function (data) {

           $scope.ownerlist =data;
           $scope.updatecall.OwnerLoginID=1;
           }).error(function (data)
          {
           console.log('owner'+data);
          });
     }


     //bind status
     $scope.bindstatus=function()
     {

       $http.get(BASE_URL_VALUE+'/lists/1/1').success(function (data) {

           $scope.statuslist =data;
           }).error(function (data)
          {
           console.log('status'+data);
          });
     }


     $scope.bindowner();
     $scope.bindstatus();

     $scope.updatecall.FaultStatusID=1;

     $scope.updatecall.Comments='test';
     $scope.descritpion='test';

  //update call  to service
   $scope.UpdateFaultService=function(objcall)
  {

    objcall.FaultID=$scope.FaultID;
    var updateurl=BASE_URL_VALUE+'/faults/update/';
    $http.post(updateurl, JSON.stringify(objcall)).success(function(data){
      if(data.length >0)
      {
        //ionic popup
       updatePopup=$ionicPopup.alert({
        title: 'Fault',
        template: 'Fault Updated Successfully'
        });
        updatePopup.then(function(res) {
          $state.go('app.opencall');
       });
      }
    }).error(function(data)
    {

     console.log('updatefault' +data);
    });

  }

 })
 .controller('newcallCtrl', function ($http,$scope, $stateParams,$filter,$state,$ionicPopup) {
//initalize the model in call
   $scope.objcall = {
     DepartmentID:0,
     AssetID:0,
     CommonFaultID:0,
     OwnerLoginID:0,
     Fault:'',
     IsDowntime:false
   };
   //initalize the service url
   const BASE_URL_VALUE = "http://192.168.0.137/LH_Mobile_Backend";
   $scope.UserId=window.localStorage.getItem("UserId"); //get the login userid
   if($scope.UserId ==undefined || $scope.UserId =="" || $scope.UserId == null)
   {
     $state.go('login');
   }
  $scope.departmentlist='';

  $scope.Assetslist='';

  $scope.faultlist='';
  $scope.ownerlist='';

//bind departments
  $scope.binddepartments = function(){
    $http.get(BASE_URL_VALUE +'/lists/5/1').success(function (data) {
              $scope.departmentlist=data;
        }).error(function (data)
       {
        console.log('deparment'+data);
       });
   }
   //department dropdown change event
   $scope.changedepartment=function(value)
    {
    $scope.bindassets (value);
    }

   //bind Asset by departmentId
   $scope.bindassets = function(value){
     $scope.Assetslist='';
     $http.get(BASE_URL_VALUE+'/lists/4/'+value).success(function (data) {
         //$scope.Assetslist = $filter('filter')(data, { DepartmentID: value });
         $scope.Assetslist =data;
         }).error(function (data)
        {
         console.log('asset'+data);
        });
    }

    //bind Fault
    $scope.bindfault=function()
    {
      $http.get(BASE_URL_VALUE+'/lists/3/1').success(function (data) {
          $scope.faultlist =data;
          }).error(function (data)
         {
          console.log('owner'+data);
         });
    }


    //bind owner
    $scope.bindowner=function()
    {

      $http.get(BASE_URL_VALUE+'/lists/2/1').success(function (data) {

          $scope.ownerlist =data;
          }).error(function (data)
         {
          console.log('owner'+data);
         });
    }


  $scope.binddepartments();
  $scope.bindfault();
  $scope.bindowner();

 //new call add to service
   $scope.addcalltoservice=function(objcall)
  {

    var saveurl=BASE_URL_VALUE+'/faults/add/';

    $http.post(saveurl,JSON.stringify(objcall)).success(function(data){
      if(data == "1")
      {
        //ionic popup
       savePopup=$ionicPopup.alert({
        title: 'Fault',
        template: 'Fault saved Successfully'
        });
        savePopup.then(function(res) {
          $state.go('app.opencall');
       });

      }
    }).error(function(data)
    {
    console.log('savefault' +data);
    });

  }


 })

.controller('LoginCtrl', function ($scope, $state,$http,$ionicPopup) {
  //initalize the model in login
  $scope.authorization = {
    username: '',
    password : ''
  };
     //initalize the service url
  const BASE_URL_VALUE = "http://192.168.0.137/LH_Mobile_Backend"
//login event
    $scope.LogIn = function (form) {
      if(form.$valid) //validation checking
      {
        var url=BASE_URL_VALUE+'/login/'+$scope.authorization.username+'/'+$scope.authorization.password;
        $http.get(url).success(function (data) {

          if(data.length>0)
          {
          if(typeof(Storage) != "undefined")
           {
           localStorage.setItem("UserId", data[0].ownerloginid); //store the data from localstorage
          //go to the calllist page
           $state.go('app.opencall');
          }
         }
         else {
             if(data.StatusCode == 401)
             {
               $scope.authorization = {
                 username: '',
                 password : ''
               };
               form.$setPristine();
               //ionic popup
               $ionicPopup.alert({
               title: 'Login',
               template: 'Invalid Credentials.Try again'
               });

             }
         }
        }).error(function (data)
          {
          console.log('owner'+data);
        });
      }

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
});
