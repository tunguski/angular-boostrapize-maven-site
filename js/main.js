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

  $.fn.pop = function() {
    var top = this.get(-1);
    this.splice(this.length-1,1);
    return top;
  };
})(jQuery);



(function() {
  angular.module('ngBootstrapizeMaven', ['ngAnimate','ngAria', 'ui.bootstrap', 'ngSanitize'])
  
  
  .controller('AppCtrl', function ($scope, $http, $location, pageCache, siteScanner) {
    $scope.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 100);
    }
    
    
    $scope.outerHtml = function (jq) {
      return jq.map(function (index, element) {
        return angular.element(element).prop('outerHTML');
      });
    }
    
    
    $scope.executeWithSite = function (part, fn) {
      part = part ? part : 'site';
      this.$watch('mvn.' + part, function (element) {
        if (element) fn($scope.mvn, element);
      });
    }
    
    
    $scope.resolvePagePresentation = function (data) {
      if (data.indexOf('packageListFrame') >= 0) {
        // jxr
        $scope.pagePresentation = '/views/jxr-page.html';
      } else if (data.indexOf('Rendered using Apache Maven Fluido Skin') >= 0
                 || data.indexOf('<link rel="stylesheet" href="./css/apache-maven-fluido-') >= 0) {
        // default presentation
        $scope.pagePresentation = '/views/fluido-site-page.html';
      } else {
        // default presentation
        $scope.pagePresentation = '/views/default-site-page.html';
      }
    };
    
    
    $scope.$on('$locationChangeSuccess', function (data) {
      $scope.hash = $location.path();
      $scope.page = '/maven' + $scope.hash;
      
      if ($scope.hash.indexOf('_views/') == 0
          || $scope.hash.indexOf('/_views/') == 0) {
        $scope.pagePresentation = $scope.hash.substr($scope.hash.indexOf('_') + 1);
      } else {
        pageCache.load($scope.page, function (data) {
          $('html, body').animate({ scrollTop: 0 }, 100);

          // switch presentation if necessary - pass full source for beter detection
          $scope.resolvePagePresentation(data.src);

          data = data.trimmed;

          $scope.mvn = {};

          // show new content to presenter
          $scope.pageSrc = data;
        });
      }
    });
  })
  
  
  .controller('FooterCtrl', function ($scope) {
    $scope.executeWithSite('footerContent', function (mvn) {
      $scope.footerHtml = angular.element($scope.mvn.footerContent).prop('outerHTML');
    });
  })
  
  
  .directive('dynamicElement', function ($compile) {
    return { 
      restrict: 'E', 
      replace: true,
      link: function(scope, element, attrs) {
        scope.$watch(attrs.message, function (content) {
        var template = $compile(content)(scope);
        element.replaceWith(template);               
        });
      }
    };
  })
  ;
})();


