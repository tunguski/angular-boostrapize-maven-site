(function() {
  angular.module('ngBootstrapizeMaven')
  .controller('ReportsListPageCtrl', function ($scope, $rootScope) {
    if (!$rootScope.d3Initialized) {
      var s = document.createElement('script');
      s.src = '//d3js.org/d3.v3.min.js';
      s.charset = 'utf-8';
      document.body.appendChild(s);
      
      $rootScope.d3Initialized = true;
    }
  })
  .controller('ReportsListNaviCtrl', function ($scope) {
  })
  .controller('ReportsListContentCtrl', function ($scope) {
  })
  .controller('ReportsListDownloadCtrl', function ($scope) {
  })
  ;
})();

