(function() {
  angular.module('abms')
  
  
  .service('framedViewService', function ($rootScope, $http, $location, pageCache) {
    var framedViewService = {
      baseConfiguration: function ($scope) {
        $scope.$watch('pageSrc', function (pageSrc) {
          $scope.mvn.site = $(pageSrc);
          $rootScope.title = 'Apache ';
        });


        $scope.project = {
          name: '',
          elements: []
        };

        
        function getElement(path, base) {
          var element = _.findWhere(base.elements, { name: path });
          if (!element) {
            element = {
              name: path,
              elements: []
            };
            base.elements.push(element);
          }
          return element;
        }
        
        
        function getPackage(pathElements) {
          var base = $scope.project;

          angular.forEach(pathElements, function (part) {
            base = getElement(part, base);
          });
          
          return base;
        }
        

        $scope.executeWithSite('packageListFrame', function (mvn, frame) {
          mvn.packageList = frame.find('li a');
          $scope.packages = $scope.outerHtml(mvn.packageList);

          angular.forEach($scope.elements, function (package) {
            getPackage($(package).text().split('.'));
          });
        });


        $scope.executeWithSite('packageFrame', function (mvn, frame) {
          mvn.allClasses = frame.find('li a');
          $scope.classes = $scope.outerHtml(mvn.allClasses);

          angular.forEach($scope.classes, function (clazz) {
            var path = $(clazz).data('href').replace(/.html/, '').split('/').slice(1);
            
            var package = getPackage(path.slice(0, -1));
            
            package.elements.push({
              name: path.slice(-1)[0],
              isClass: true
            });
          });
        });


        $scope.loadFrame = function (frameName, successFn) {
          var match = $scope.pageSrc.match(new RegExp('<frame src="(.*?)" name="' + frameName + '"'));
          if (match) {
            var frameSrc = $scope.pageSrc.match(
              new RegExp('<frame src="(.*?)" name="' + frameName + '"'))[1];
            // if location ends with file, remove it
            var base = $location.absUrl().replace(/(^|\/)[^./]+\.[^/]+$/, '');

            $scope.page(base + '/' + frameSrc, frameName, successFn);
          }
          
          return frameSrc;
        };


        $scope.executeWithSite('', function (mvn) {
          $scope.loadFrame('packageListFrame', function (data, url) {
            $scope.packageListFrameUrl = url;
            // load classes after loading packages
            $scope.loadFrame('packageFrame', function (data, url) {
              $scope.packageFrameUrl = url;
            });
          });
          
          // if frame does not exist, probably it's redirection to single javadoc page
          if (!$scope.loadFrame('classFrame')) {
            $scope.mvn['classFrame'         ] = mvn.site;
            $scope.mvn['classFrame' + 'Path'] = $location.path();
          }
        });


        $scope.page = function (href, frameName, successFn) {
          pageCache.load(href, function (data) {
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

