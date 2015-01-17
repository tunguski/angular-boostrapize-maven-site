(function() {
  angular.module('ngBootstrapizeMaven')
  
  
  .service('framedViewService', function ($rootScope, $http, $location, pageCache) {
    var framedViewService = {
      baseConfiguration: function ($scope) {
        $scope.$watch('pageSrc', function (pageSrc) {
          $scope.mvn.site = $(pageSrc);
          $rootScope.title = 'Apache Maven';
        });


        $scope.project = {
          src: []
        };


        $scope.executeWithSite('packageListFrame', function (mvn, frame) {
          mvn.packageList = frame.find('li a');
          $scope.elements = $scope.outerHtml(mvn.packageList);

          function getElement(path, base) {
            var element = _.findWhere(base.src, { name: path });
          }

          angular.forEach($scope.elements, function (package) {
            var packages = $(package).text().split('.');
          });
        });


        $scope.loadFrame = function (frameName, successFn) {
          var frameSrc = $scope.pageSrc.match(
            new RegExp('<frame src="(.*?)" name="' + frameName + '"'))[1];
          var base = $location.absUrl().substr(0, $location.absUrl().lastIndexOf('/') + 1);

          $scope.page(base + frameSrc, frameName, successFn);
        };


        $scope.executeWithSite('', function (mvn) {
          $scope.loadFrame('packageListFrame', function (data, url) {
            $scope.packageListFrameUrl = url;
          });
          $scope.loadFrame('packageFrame', function (data, url) {
            $scope.packageFrameUrl = url;
          });
          $scope.loadFrame('classFrame');
        });


        $scope.page = function (href, frameName, successFn) {
          pageCache.load(href.replace(/#/g, 'maven'), function (data) {
            if (!data.jxr) {
              data.jxr = $(data.trimmed);
              data.jxr.find('a[href]').each(function () {
                var href = $(this).attr('href');
                $(this).removeAttr('href');
                $(this).attr('data-href', href);
                $(this).attr('ng-click', 'page(\'' + href + '\'' 
                             + ( $(this).attr('target') ? ', \'' 
                                + $(this).attr('target') + '\'' : '' ) 
                             + ')');
                });
            }

            $scope.mvn[ frameName || 'classFrame'          ] = data.jxr;
            $scope.mvn[(frameName || 'classFrame') + 'Path'] = href;
            if (successFn) {
              successFn(data, href);
            }
          });
        };
      }
    };
    
    return framedViewService;
  })
  ;
})();

