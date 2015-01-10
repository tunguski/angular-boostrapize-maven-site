(function() {
  angular.module('ngBootstrapizeMaven')
  
  
  .controller('JxrCtrl', function ($scope, $http, $location) {
    $scope.$watch('pageSrc', function (pageSrc) {
      $scope.mvn.site = $(pageSrc);
    });

    
    $scope.loadFrame = function (frameName) {
      var frameSrc = $scope.pageSrc.match(new RegExp('<frame src="(.*?)" name="' + frameName + '" \/>'))[1];
      var base = $location.absUrl().substr(0, $location.absUrl().lastIndexOf('/') + 1).replace(/\/#/g, '/maven');
      $http.get(base + frameSrc).success(function (data) {
        $scope.mvn[frameName] = $($scope.trimPageContent(data));
      });
    };
    
    
    $scope.executeWithSite('', function (mvn) {
      $scope.loadFrame('packageListFrame');
      $scope.loadFrame('packageFrame');
      $scope.loadFrame('classFrame');
    });
  })
  
  
  .controller('JxrOverviewCtrl', function ($scope, $http) {
    $scope.executeWithSite('packageListFrame', function (mvn, frame) {
      mvn.packageList = frame.find('li a');
      $scope.elements = $scope.outerHtml(mvn.packageList);
    });
  })
  
  
  .controller('JxrAllClassesCtrl', function ($scope, $http) {
    $scope.executeWithSite('packageFrame', function (mvn, frame) {
      mvn.allClasses = frame.find('li a');
      $scope.elements = $scope.outerHtml(mvn.allClasses);
    });
  })
  
  
  .controller('JxrSummaryCtrl', function ($scope, $http) {
    $scope.executeWithSite('classFrame', function (mvn, frame) {
      var summary = [];
      var firstChild = $(frame.find('.framenoframe')[0]).next();
      while (!firstChild.hasClass('framenoframe') && !firstChild.hasClass('overview')) {
        summary.push(firstChild);
        firstChild = firstChild.next();
      }
      
      mvn.summary = summary[0];
      for (i = 1; i < summary.length; i++) {
        mvn.summary = mvn.summary.add(summary[i]);
      }
      
      $scope.summary = $scope.outerHtml(mvn.summary);
    });
  })
  ;
})();
