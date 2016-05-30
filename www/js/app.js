// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('starter', ['ionic','ngMessages','angular.filter'])

app.run(function($ionicPlatform) {
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
//initalize the service url assign constant
app.constant('BASE_URL_VALUE', 'http://192.168.0.137/LH_Mobile_Backend');

app.config(function ($stateProvider, $urlRouterProvider) {

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
         .state('Servicedetails', {
             cache: false,
             url: "/Servicedetails",
             templateUrl: "templates/Servicedetails.html",
             controller: 'ServicedetailCtrl'
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




app.controller('AppCtrl', function ($scope, $state) {
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

app.controller('opencallCtrl', function ($scope, $state,$http,BASE_URL_VALUE,$rootScope) {
    //variable initialization

     $scope.calllists='';
     $scope.UserId=window.localStorage.getItem("UserId"); //get the login userid
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
          //assigning  falutlist
          $scope.$broadcast('scroll.refreshComplete');
          $scope.calllists=data;
          }).error(function (data)
         {
          console.log('calls'+data);
         });
    }

    //call binding
    $scope.bindcalls();

    $scope.Updatecall=function(callist)
    {

      $rootScope.editcalllist=callist;
       $state.go('app.updatecall', {callistId: callist.FaultID});
        //$state.go('app.updatecall');
    }



})

 app.controller('updatecallCtrl', function ($scope, $stateParams,$http,$state,$ionicPopup,BASE_URL_VALUE,$rootScope) {
    //variable initalize
    $scope.updatecall = {
      FaultID:0,
      OwnerLoginID:0,
      Comments:'',
      FaultStatusID:0
    };
     $scope.name='';
     $scope.ownerlist='';
     $scope.statuslist='';
     //parameter assigned to scope variable
     $scope.FaultID=$state.params.callistId;

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




     if($rootScope.editcalllist !=undefined || $rootScope.editcalllist !="" || $rootScope.editcalllist !=null )
     {

       if($rootScope.editcalllist.FaultStatusID != "0")
       {
       $scope.updatecall.FaultStatusID=$rootScope.editcalllist.FaultStatusID.toString();
       }
      $scope.updatecall.Comments=$rootScope.editcalllist.Fault;

      $scope.name='Fault ' + $scope.FaultID;
      $scope.Asset=$rootScope.editcalllist.Asset;
      $scope.CommonFault=$rootScope.editcalllist.CommonFault;
      //$scope.updatecall.OwnerLoginID=$scope.UserId;
      $scope.updatecall.OwnerLoginID=$rootScope.editcalllist.OwnerLoginID.toString();
     }

  //update call  to service
   $scope.UpdateFaultService=function(objcall)
  {

    objcall.FaultID=$scope.FaultID;
    var updateurl=BASE_URL_VALUE+'/faults/update/';
    $http.post(updateurl, JSON.stringify(objcall)).success(function(data,status){

      if(status==200)
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

    }).error(function(data,status)
    {
        if(status == 503){
          errorpopup=$ionicPopup.alert({
           title: 'Fault',
           template: 'Service Unavailable.Please try again.'
           });
           errorpopup.then(function(res) {
          });
       }


    });

  }

 })
 app.controller('newcallCtrl', function ($http,$scope, $stateParams,$filter,$state,$ionicPopup,BASE_URL_VALUE) {
//initalize the model in call
   $scope.objcall = {
     AssetID:0,
     CommonFaultID:0,
     OwnerLoginID:0,
     Fault:'',
     IsDowntime:false
   };

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
     var asseturl='';
     if(value == 0)
     {
      asseturl=BASE_URL_VALUE+'/lists/4/';
     }
     else {
       asseturl=BASE_URL_VALUE+'/lists/4/'+value;
     }
     $http.get(asseturl).success(function (data) {
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
          if($scope.faultlist.length>0)//set Select First Row
           {
           $scope.objcall.CommonFaultID=$scope.faultlist[0].CommonFaultID.toString();
         } 
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
  $scope.bindassets(0);

 //new call add to service
   $scope.addcalltoservice=function(objcall)
  {
    var saveurl=BASE_URL_VALUE+'/faults/add/';
    $http.post(saveurl,JSON.stringify(objcall)).success(function(data,status){
      if(status==200)
      {
        //ionic popup
        var faultid=data;
       savePopup=$ionicPopup.alert({
        title: 'Fault',
        template: 'Fault saved Successfully'
        });
        savePopup.then(function(res) {
          $state.go('app.opencall');
       });
      }

    }).error(function(data,status)
    {
      if(status == 503){
        errorpopup=$ionicPopup.alert({
         title: 'Fault',
         template: 'Service Unavailable.Please try again.'
         });
         errorpopup.then(function(res) {

        });
     }

    });


  }


 })
 app.controller('ServicedetailCtrl',function($scope,$state,$http,BASE_URL_VALUE)
{
  $scope.servicedetails = {
    IPAddress: '',
    hosttype : ''
  };
  $scope.servicedetails = function (form) {
    if(form.$valid) //validation checking
    {

      if ($scope.servicedetails.IPAddress != '0.0.0.0' &&  $scope.servicedetails.IPAddress != '255.255.255.255' &&
            $scope.servicedetails.IPAddress.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
            {
             localStorage.setItem("IPAddress",   $scope.servicedetails.IPAddress); //store the data from ip address
             if($scope.servicedetails.hosttype)
             {
              localStorage.setItem("hosttype",   $scope.servicedetails.hosttype); //store the data from host type
             }
             else {
               localStorage.setItem("hosttype",   'http'); //store the data from host type
             }
             BASE_URL_VALUE= localStorage.getItem("hosttype") +'://'+ localStorage.getItem("IPAddress")+'/LH_Mobile_Backend'
             $state.go('login');
       } else {
           // Match attempt failed
           $scope.message="Invalid Ip Address";
       }

    }
  }
})
app.controller('LoginCtrl', function ($scope, $state,$http,$ionicPopup,BASE_URL_VALUE) {
  //initalize the model in login
  $scope.authorization = {
    username: '',
    password : ''
  };

  //check service host in localhost
  $scope.checkservicehost=function()
  {

    if(localStorage.getItem("IPAddress") == "undefined" || localStorage.getItem("IPAddress") == null || localStorage.getItem("IPAddress") =="")
     {
    //go to the calllist page
     $state.go('Servicedetails');
     }
  }
//call service hosttype
  $scope.checkservicehost();

//login event
    $scope.LogIn = function (form) {
      if(form.$valid) //validation checking
      {

        var url=BASE_URL_VALUE+'/login/'+$scope.authorization.username+'/'+$scope.authorization.password;
        $http.get(url).success(function (data,status) {
          if(data.length>0)
          {
          if(typeof(Storage) != "undefined")
           {
           localStorage.setItem("UserId", data[0].ownerloginid); //store the data from localstorage
          //go to the calllist page
           $state.go('app.opencall');
          }
         }

       }).error(function (data,status)
        {
          if(status == 401)
          {
            $scope.authorization = {
              username: '',
              password : ''
            };
            form.$setPristine();
            //ionic popup
            //$ionicPopup.alert({
           // title: 'Login',
           // template: 'Invalid Credentials.Try again'
           // });
           $scope.message="Invalid Credentials.Please try again";

          }
        });
      }

    };

})

app.directive('myDirective', function ($filter) {
    return function (scope,element, attr) {
      // var date = new Date(scope.callist.OpenDT).toUTCString();
       //var formatdate=new Date(scope.callist.OpenDT).toISOString().split('T')[0].split('-').reverse().join('/') +' ' + new Date(scope.callist.OpenDT).toISOString().split('T')[1].split('.')[0];
       var formatdate=new Date(scope.callist.OpenedDT).toLocaleDateString() + ' ' + new Date(scope.callist.OpenedDT).toLocaleTimeString();
       element.html('Opened at ' + formatdate);

    };
});
