(function() {
  angular.module('abms')
  .controller('LinkagePageCtrl', function ($scope, siteScanner) {
    $scope.siteScanner = siteScanner;
  })
  
  
  .controller('LinkageNaviCtrl', function ($scope) {
  })
  
  
  .controller('LinkageContentCtrl', function ($scope, config) {
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
      if (link.indexOf('/' + config.base) == 0) {
        link = link.substr(config.base.length);
      } else if (link.indexOf(config.base) == 0) {
        link = link.substr(config.base.length);
      }
      
      return link.length ? link : '/';
    };
    
    $scope.type = 'all';
    $scope.showType = function (type) {
      $scope.type = type;
    };
    
    $scope.shouldShowPage = function (pageName, pageDetails) {
      if ($scope.type === 'all') {
        return true;
      }
      
      return _.findWhere(pageDetails, { status: $scope.type });
    };
    
    $scope.shouldShowPageReference = function (link, linkDetails) {
      return $scope.type === 'all' 
          || (linkDetails && linkDetails.status === $scope.type);
    };
  })
  
  
  .controller('LinkageDownloadCtrl', function ($scope) {
  })
  ;
})();

