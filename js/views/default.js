(function() {
  angular.module('abms')
  
  
  .controller('DefaultSitePageCtrl', function ($scope, $rootScope, $timeout) {
    $scope.$watch('pageSrc', function (pageSrc) {
      if (pageSrc) {
        var mvnSite = $scope.mvn.site = $(pageSrc);
        $scope.mvn.bodySections = mvnSite.find('#contentBox > *');
        $scope.mvn.naviContent = mvnSite.find('#navcolumn > *');
        $scope.mvn.downloadSections = mvnSite.find('#downloadbox .section > .section > .section');
        $scope.mvn.footerContent = mvnSite.find('#footer .xright');

        // page header
        $rootScope.lastPublished = mvnSite.find('#breadcrumbs .xright').text();
        $rootScope.title = '';
        mvnSite.find('#breadcrumbs .xleft a').each(function () {
          $rootScope.title = $rootScope.title + ' ' + $(this).text();
        });
        $rootScope.title = $rootScope.title.trim();
        
        // FIXME: remove all images - should leave images from content
        mvnSite.find('img').remove();
        // fix style for tables
        mvnSite.find('table').each(function (index) {
          $(this).removeClass().addClass('table').addClass('table-condensed').addClass('');
          $(this).find('tr').has('th').each(function (index) {
            
          });
        });
        
        
        // remove downloadbox from default content
        $scope.mvn.bodySections.find('#downloadbox').detach();
        
        $timeout(function () {
          $(document).ready(function() {
            $('pre').each(function(i, block) {
              hljs.highlightBlock(block);
            });
          });
        });
      }
    });
  })
  
  
  .controller('NaviCtrl', function ($scope, menuMemory) {
    $scope.executeWithSite('naviContent', function (mvn) {
      $scope.elements = [];
      $scope.visibility = [];

      angular.forEach($scope.mvn.naviContent, function (element, index) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
        $scope.visibility.push(index % 2 == 0
                               || menuMemory.isOpen($($scope.elements[index - 1]).text()));
      });
    });
    
    $scope.toggleCollapse = function (index) {
      if (index % 2 == 0) {
        $scope.visibility[index + 1] = !$scope.visibility[index + 1];
        menuMemory.clicked($($scope.elements[index]).text());
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
   
      // FIXME: what to do with real anchors?
//       $timeout(function () {
//         $(".page-presentation a")
//           .filter(function() { 
//             return this.href.match(/#.*#/);
//           })
//           .click(function () {
//             alert('scroll to anchor');
//           });
//       });

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