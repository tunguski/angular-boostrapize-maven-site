(function() {
  angular.module('abms')
  
  
  .controller('FluidoSitePageCtrl', function ($scope, $rootScope, $timeout) {
    $scope.$watch('pageSrc', function (pageSrc) {
      if (pageSrc) {
        var hash = $scope.hash;

        var mvnSite = $scope.mvn.site = $(pageSrc);
        $scope.mvn.bodySections = mvnSite.find(
          // http://maven.apache.org/general.html introduced exception with dl outside section
          '#bodyColumn');
        
        if (mvnSite.find('#leftColumn .nav').length) {
          // side menu
          $scope.mvn.naviContent = [];
          
          var sublist;
          
          mvnSite.find('#leftColumn .nav > li').each(function () {
            if ($(this).hasClass('nav-header')) {
              if (sublist) {
                $scope.mvn.naviContent.push(sublist);
              }
              $scope.mvn.naviContent.push($('<h5>' + $(this).text() + '</h5>'));
              sublist = $('<ul></ul>');
            } else {
              sublist.append(this);
            }
          });
          // last sublist after finishing processing
          $scope.mvn.naviContent.push(sublist);
          
          mvnSite.find('.nav').find('*').removeClass();
          
        } else if (mvnSite.find('#leftColumn .sidebar-nav').length) {
          // side menu with better formatting
          $scope.mvn.naviContent = mvnSite.find('#leftColumn .sidebar-nav > *:not(.divider)');
          $scope.mvn.naviContent.each(function (index) {
            if (this.tagName === 'H3') {
              $scope.mvn.naviContent[index] = $('<h5>' + $(this).text() + '</h5>');
            }
          });
          
        } else if (mvnSite.find('#topbar .nav').length) {
          // topbar menu
          $scope.mvn.naviContent = mvnSite.find('.nav > .dropdown > *');
          mvnSite.find('.nav').find('*').removeClass();
          $scope.mvn.naviContent.each(function (index) {
            if (this.tagName.toLowerCase() === 'a') {
              $scope.mvn.naviContent[index] = $('<h5>' + $(this).text() + '</h5>');
            }
          })
          $scope.mvn.naviContent.filter('a').replaceWith(function () {
            return '<h5>' + $(this).text() + '</h5>';
          });
        }
        
        $scope.mvn.downloadSections = mvnSite.find('#downloadbox .section > .section > .section');
        $scope.mvn.footerContent = mvnSite.find('footer .row');
        $scope.mvn.footerContent.removeClass()

        // page header
        $rootScope.lastPublished = mvnSite.find('#publishDate').text();
        $rootScope.projectVersion = mvnSite.find('#projectVersion').text();
        $rootScope.title = '';
        mvnSite.find('.breadcrumb li:not(.divider):not(.pull-right) a').each(function () {
          if ($(this).text().trim() === 'Apache'
              || $(this).text().trim() === 'Maven') {
            return;
          }
          $rootScope.title = $rootScope.title + ' ' + $(this).text();
        });
        $rootScope.title = $rootScope.title.trim();
        $rootScope.title = $rootScope.title || 'Apache Maven';
        // fixme: remove duplicated prefix if present - how to detect?
        
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
        
        $timeout(function () {
          $(document).ready(function() {
            $('.section > div > pre, .source > pre').each(function(i, block) {
              hljs.highlightBlock(block);
            });
          });
          
          $('#main-navigation, #right-navigation').affix({
            offset: {
              top: function () {
                return (this.top = $('#header-container').outerHeight(true))
              },
              bottom: function () {
                return (this.bottom = $('footer').outerHeight(true))
              }
            }
          });
        });
      }
    });
  })
  
  
  .controller('FluidoNaviCtrl', function ($scope) {
    $scope.executeWithSite('naviContent', function (mvn) {
      $scope.elements = [];
      $scope.visibility = [];

      angular.forEach($scope.mvn.naviContent, function (element, index) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
        $scope.visibility.push(index % 2 == 0
                              || menuMemory.isOpen($(element).text()));
      });
    });
    
    $scope.toggleCollapse = function (index) {
      if (index % 2 == 0) {
        $scope.visibility[index + 1] = !$scope.visibility[index + 1];
      }
    };
  })
  
  
  .controller('FluidoDownloadCtrl', function ($scope) {
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
  
  
  .controller('FluidoContentCtrl', function ($scope, $location, siteIndex) {
    $scope.executeWithSite('bodySections', function (mvn) {
      $scope.elements = [];
      
      var pageText = '';

      angular.forEach($scope.mvn.bodySections, function (element) {
        $scope.elements.push(angular.element(element).prop('outerHTML'));
        pageText = pageText + ' \n ' + angular.element(element).text().trim();
      });

      siteIndex.savePage($location.path(), pageText.trim());
    });
  })
  ;

})();