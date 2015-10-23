'use strict';

/**
 * @ngdoc overview
 * @name orgApp
 * @description
 * # orgApp
 *
 * Main module of the application.
 */
angular
  .module('orgApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    'worldskills.utils',
    'restangular',
    'ui.select2',
    'angularFileUpload'
  ])
  //.config(function ($routeProvider) {
    .config(function ($routeProvider, $translateProvider, $stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, REST_BASE_URL) {
    
    $urlRouterProvider.otherwise('/');

    
  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('sanitize');

  //language negotiation
  //http://angular-translate.github.io/docs/#/guide/09_language-negotiation
  // $translateProvider.registerAvailableLanguageKeys(['en', 'pt'], {
  //   'en_US': 'en',
  //   'en_UK': 'en',
  //   'pt_BR': 'pt'    
  // });

  RestangularProvider.setBaseUrl(REST_BASE_URL);

//routes
  $stateProvider

  // //index
    .state('index', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      data: {
          requireLoggedIn: true
      }
    })
    .state('member_list', {
      url: '/members',
      templateUrl: 'views/member_list.html',
      controller: 'MemberListCtrl',
      data: {
          requireLoggedIn: true
      }
    })
    .state('member', {
      url: '/members/{member_id}',
      templateUrl: 'views/member.html',
      controller: 'MemberCtrl',
      data: {
          requireLoggedIn: true
      }
    });

  })
.run(function($rootScope, $state, $stateParams, auth, user, $window, Restangular){
  $rootScope.available_languages = {"en":"English"};

  $rootScope.initialised = false;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  
  if (!auth.loggedIn )
  {
	  $window.location.href = auth.loginUrl;
  }
  
  Restangular.setErrorInterceptor(
	  function(response)
	  {
		  // if the user is not authorised to perform the action, redirect to login
		  if (response.status == 401 || response.status == 403)
		  {
			  $window.location.href = auth.loginUrl;
		  }
	  }
  );
  
});