(function() {
  angular.module('ngBootstrapizeMaven')
  
  
  .controller('JxrCtrl', function ($scope, $http, $location) {
    $scope.pageCache = {};
    
    $scope.$watch('pageSrc', function (pageSrc) {
      $scope.mvn.site = $(pageSrc);
    });
    
    
    $scope.loadPage = function (pageName, successFn) {
      function processPage(data) {
        var base = pageName.substring(0, pageName.lastIndexOf('/') + 1);
        data = $($scope.trimPageContent(data));
        data.find('a').each(function () {
          var href = $(this).attr('href');
          href = href.indexOf('/') == 0 ? href : base + href;
          $(this).removeAttr('href');
          $(this).attr('data-href', href);
//           $(this).attr('ng-click', 'page(\'' + href + '\'' 
//                        + ( $(this).attr('target') ? ', \'' + $(this).attr('target') + '\'' : '' ) 
//                        + ')');
        });

        successFn(data);
      }
      
      if ($scope.pageCache[pageName]) {
        processPage($scope.pageCache[pageName]);
      } else {
        $http.get(pageName).success(function (data) {
          $scope.pageCache[pageName] = data;
          processPage(data);
        });
      }
    };

    
    $scope.loadFrame = function (frameName) {
      var frameSrc = $scope.pageSrc.match(new RegExp('<frame src="(.*?)" name="' + frameName + '" \/>'))[1];
      var base = $location.absUrl().substr(0, $location.absUrl().lastIndexOf('/') + 1).replace(/\/#/g, '/maven');
      
      $scope.loadPage(base + frameSrc, function (data) {
        $scope.mvn[frameName] = data;
        $scope.mvn[frameName + 'Path'] = base + frameSrc;
      });
    };
    
    
    $scope.executeWithSite('', function (mvn) {
      $scope.loadFrame('packageListFrame');
      $scope.loadFrame('packageFrame');
      $scope.loadFrame('classFrame');
    });
    
    
    $scope.page = function (element) {
      var href = $(element.toString()).data('href')
      var frameName = $(element.toString()).attr('target');
      
      $scope.loadPage(href, function (data) {
        $scope.mvn[ frameName || 'classFrame'          ] = data;
        $scope.mvn[(frameName || 'classFrame') + 'Path'] = base + href;
      });
    };
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
      if (frame.find('.framenoframe').length) {
        var summary = [];
        var firstChild = $(frame.find('.framenoframe')[0]).next();
        while (firstChild.length && !firstChild.hasClass('framenoframe') && !firstChild.hasClass('overview')) {
          summary.push(firstChild);
          firstChild = firstChild.next();
        }

        mvn.summary = summary[0];
        for (i = 1; i < summary.length; i++) {
          mvn.summary = mvn.summary.add(summary[i]);
        }
      } else {
        mvn.summary = frame;
      }
      
      $scope.summary = $scope.outerHtml(mvn.summary);
    });
  })
  ;
})();

