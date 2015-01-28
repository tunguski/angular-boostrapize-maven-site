(function() {
  angular.module('abms')
  .controller('SiteMapPageCtrl', function ($scope, siteScanner) {
    $scope.siteScanner = siteScanner;
  })
  .controller('SiteMapNaviCtrl', function ($scope) {
  })
  .controller('SiteMapContentCtrl', function ($scope) {
  })
  .controller('SiteMapDownloadCtrl', function ($scope) {
  })
  ;
})();

