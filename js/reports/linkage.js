(function() {
  angular.module('ngBootstrapizeMaven')
  .controller('LinkagePageCtrl', function ($scope, siteScanner) {
    $scope.siteScanner = siteScanner;
  })
  .controller('LinkageNaviCtrl', function ($scope) {
  })
  .controller('LinkageContentCtrl', function ($scope) {
    $scope.countErrors = function (element) {
      var count = 0;
      angular.forEach(element, function (value) {
        if (value && value.status === 404) {
          count = count + 1;
        }
      });
      return count;
    };
    
    $scope.countPages = function (element) {
      var count = 0;
      angular.forEach(element, function (value) {
        if (value && value.status === 200) {
          count = count + 1;
        }
      });
      return count;
    };
    $scope.keys = function (element) {
      return Object.keys(element).length;
    };
    
    $scope.trimRedirect = function (link) {
      if (link.indexOf('/maven/') == 0) {
        link = link.substr('/maven'.length);
      } else if (link.indexOf('maven/') == 0) {
        link = link.substr('maven/'.length);
      }
      
      return link.length ? link : '/';
    }
  })
  .controller('LinkageDownloadCtrl', function ($scope) {
  })
  ;
})();

