(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
})(jQuery);



(function() {
  function executeWithSite ($scope, fn) {
    $scope.$watch('mvn', function (mvn) {
      if (mvn) fn(mvn);
    });
  }

  
  angular.module('ngBootstrapizeMaven', ['ngAnimate','ngAria', 'ui.bootstrap', 'ngSanitize'])
  
  
  .config(function ($locationProvider) {
    //$locationProvider.html5Mode(true);
//     $routeProvider
//       .when('/:page', {
//         templateUrl: 'partials/phone-list.html',
//         controller: 'PhoneListCtrl'
//       })
//       .when('/:dir/:page', {
//         templateUrl: 'partials/phone-list.html',
//         controller: 'PhoneListCtrl'
//       })
//     ;
  })
  
  
  .controller('AppCtrl', function ($scope, $http, $location) {
    $scope.$on('$locationChangeSuccess', function (data) {
      var hash = $location.path();
      var page = '//maven.matsuo-it.com/maven' + hash;
      
      $http.get(page).success(function (data) {
        // get only body content, as jquery cannot parse full page
        data = data.substring(data.indexOf('<body'), data.lastIndexOf('</body>'));
        // stop images from loading
        data = data.replace(/<img /g, '<i ').replace(/<\/img>/g, '</i>');
        // rewrite links so they work in ang-boot-mav-site
        data = data.replace(/href=".*?"/g, function (match, index, fullText) {
          // page we are starting from
          var hashCopy = (hash.indexOf('/') >= 0 && hash.lastIndexOf('/') + 1 != hash.length) 
                ? hash.substr(0, hash.lastIndexOf('/')) : hash;
          
          // for external links return what was matched
          if (match.indexOf('href="http') == 0) {
            return match;
          }
          
          var i = 0;
          while (true) {
            i = i + 1;
            if (i > 100) {
              throw Error('infinite loop');
            }
            
            if (match.indexOf('href="/') === 0) {
              // do not modify absolute paths
              break;
            } else if (match.indexOf('href="../') >= 0) {
              // it's not perfect as '....//' will generate two folds, but I assume page hrefs are safe
              match = match.replace(/\.\.\//, '');
              hashCopy = hashCopy.substr(0, hashCopy.lastIndexOf('/'));
            } else if (match.indexOf('href="./') >= 0) {
              // it's not perfect as '....//' will generate two folds, but I assume page hrefs are safe
              match = match.replace(/\.\//, '');
            } else {
              break;
            }
          }

          // add hash to href
          return 'href="#' + (hashCopy && !(match.indexOf('href="/') === 0) 
                              ? hashCopy + '/' : '' ) + match.substr(6);
        });

        var mvnSite = $('<div>' + data + '</div>');
        $scope.mvn = {
          site: mvnSite,
          breadcrumb: {
            lastPublished: mvnSite.find('#breadcrumbs .xright')
          },
          body: {
            sections: mvnSite.find('#contentBox > *')
          },
          navi: {
            content: mvnSite.find('#navcolumn > *')
          },
          download: {
            sections: mvnSite.find('#downloadbox .section > .section > .section')
          },
          footer: {
            content: mvnSite.find('#footer .xright')
          }
        };

        // remove all images - for better site display
        mvnSite.find('img').remove();
        // fix style for tables
        mvnSite.find('table').each(function (index) {
          $(this).removeClass().addClass('table').addClass('table-condensed').addClass('');
          $(this).find('tr').has('th').each(function (index) {
            
          });
        });
        
        
        // remove downloadbox from default content
        $scope.mvn.body.sections.find('#downloadbox').detach();
        
        // for header
        $scope.lastPublished = angular.element($scope.mvn.breadcrumb.lastPublished).text();
      });
    });
  })
  
  
  .controller('NaviCtrl', function ($scope) {
    executeWithSite($scope, function (mvn) {
      $scope.elements = [];
      $scope.visibility = [];

      angular.forEach($scope.mvn.navi.content, function (element, index) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
        $scope.visibility.push(index % 2 == 0);
      });
    });
    
    $scope.toggleCollapse = function (index) {
      if (index % 2 == 0) {
        $scope.visibility[index + 1] = !$scope.visibility[index + 1];
      }
    };
  })
  
  
  .controller('DownloadCtrl', function ($scope) {
    executeWithSite($scope, function (mvn) {
      $scope.elements = [];
      $scope.visibility = [];

      angular.forEach($scope.mvn.download.sections, function (element) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
        $scope.visibility.push(false);
      });
    });

    $scope.toggleCollapse = function (index) {
      $scope.visibility[index] = !$scope.visibility[index];
    };
  })
  
  
  .controller('ContentCtrl', function ($scope) {
    executeWithSite($scope, function (mvn) {
      $scope.elements = [];

      angular.forEach($scope.mvn.body.sections, function (element) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
      });
    });
  })
  
  
  .controller('FooterCtrl', function ($scope) {
    executeWithSite($scope, function (mvn) {
      $scope.footerHtml = angular.element($scope.mvn.footer.content).prop('outerHTML');
    });
  })
  ;
})();


