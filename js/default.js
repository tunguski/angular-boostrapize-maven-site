(function() {
  angular.module('ngBootstrapizeMaven')
  
  
  .controller('DefaultSitePageCtrl', function ($scope, $timeout) {
    $scope.$watch('pageSrc', function (pageSrc) {
      if (pageSrc) {
        var hash = $scope.hash;
        // stop images from loading
        pageSrc = pageSrc.replace(/<img /g, '<i ').replace(/<\/img>/g, '</i>');
        // rewrite links so they work in ang-boot-mav-site
        pageSrc = pageSrc.replace(/href=".*?"/g, function (match, index, fullText) {
          // page we are starting from
          var hashCopy = (hash.indexOf('/') >= 0 && hash.lastIndexOf('/') + 1 != hash.length) 
                ? hash.substr(0, hash.lastIndexOf('/')) : hash;
          
          // for external links return what was matched
          if (match.match(/http[s]?:\/\/maven.apache.org/)) {
            match = match.replace(/http[s]?:\/\/maven.apache.org/, '');
          } else if (match.indexOf('href="http') == 0) {
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

        var mvnSite = $scope.mvn.site = $(pageSrc);
        $scope.mvn.lastPublished = mvnSite.find('#breadcrumbs .xright');
        $scope.mvn.bodySections = mvnSite.find('#contentBox > *');
        $scope.mvn.naviContent = mvnSite.find('#navcolumn > *');
        $scope.mvn.downloadSections = mvnSite.find('#downloadbox .section > .section > .section');
        $scope.mvn.footerContent = mvnSite.find('#footer .xright');

        // remove all images - for better site display
        mvnSite.find('img').remove();
        // fix style for tables
        mvnSite.find('table').each(function (index) {
          $(this).removeClass().addClass('table').addClass('table-condensed').addClass('');
          $(this).find('tr').has('th').each(function (index) {
            
          });
        });
        
        
        // remove downloadbox from default content
        $scope.mvn.bodySections.find('#downloadbox').detach();
        
        // for header
        $scope.lastPublished = angular.element($scope.mvn.lastPublished).text();
        
        $timeout(function () {
          $(document).ready(function() {
            $('div.source pre').each(function(i, block) {
              hljs.highlightBlock(block);
            });
          });
        });
      }
    });
  })
  
  
  .controller('NaviCtrl', function ($scope) {
    $scope.executeWithSite('naviContent', function (mvn) {
      $scope.elements = [];
      $scope.visibility = [];

      angular.forEach($scope.mvn.naviContent, function (element, index) {
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
    $scope.executeWithSite('downloadSections', function (mvn, menu) {
      $scope.elements = [];
      $scope.scrollToElements = [];
      $scope.visibility = [];
      $scope.isMenu = !menu.length;

      if (menu.length) {
        angular.forEach(menu, function (element) {
          $scope.elements.push(angular.element(element).prop('outerHTML'));
          $scope.visibility.push(false);
        });
      } else {
        $scope.elements = mvn.site.find('h1, h2, h3').map(function (index) {
          if ($(this).text()) {
            $scope.scrollToElements.push($(this).prop("tagName") + ':contains(' + $(this).text() + ')');
            $scope.visibility.push(false);
            return '<h5>' + $(this).text() + '</h5>';
          }
        });
      }
    });

    $scope.toggleCollapse = function (index, element) {
      if ($scope.isMenu) {
        $('html, body').animate({
          scrollTop: $($scope.scrollToElements[index]).offset().top
        }, 100);
      } else {
        $scope.visibility[index] = !$scope.visibility[index];
      }
    };
  })
  
  
  .controller('ContentCtrl', function ($scope) {
    $scope.executeWithSite('bodySections', function (mvn) {
      $scope.elements = [];

      angular.forEach($scope.mvn.bodySections, function (element) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
      });
    });
  })
  
  
  .controller('FooterCtrl', function ($scope) {
    $scope.executeWithSite('footerContent', function (mvn) {
      $scope.footerHtml = angular.element($scope.mvn.footerContent).prop('outerHTML');
    });
  })
  ;

})();