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
  angular.module('ngBootstrapizeMaven', ['ngAnimate','ngAria', 'ui.bootstrap', 'ngSanitize'])
  
  
  .controller('AppCtrl', function ($scope, $http, $location) {
    
    
    $scope.outerHtml = function (jq) {
      return jq.map(function (index, element) {
        return angular.element(element).prop('outerHTML');
      });
    }
    
    
    $scope.executeWithSite = function (part, fn) {
      part = part ? part : 'site';
      $scope.$watch('mvn.' + part, function (element) {
        if (element) fn($scope.mvn, element);
      });
    }
    
    
    $scope.resolvePagePresentation = function (data) {
      if (data.indexOf('packageListFrame') >= 0) {
        // jxr
        $scope.pagePresentation = '/views/jxr-page.html';
      } else {
        // default presentation
        $scope.pagePresentation = '/views/default-site-page.html';
      }
    };
    
    
    $scope.trimPageContent = function (data) {
      if (data.indexOf('<frameset') >= 0) {
        // get only body content, as jquery cannot parse full page
        data = data.substring(data.indexOf('<frameset'), data.lastIndexOf('</frameset>'));
      } else {
        // get only body content, as jquery cannot parse full page
        data = data.substring(data.indexOf('<body'), data.lastIndexOf('</body>'));
      }
      
      return '<div>' + data.substr(data.indexOf('>') + 1) + '</div>';
    };
    
    
    $scope.$on('$locationChangeSuccess', function (data) {
      $scope.hash = $location.path();
      $scope.page = '//maven.matsuo-it.com/maven' + $scope.hash;
      
      $http.get($scope.page).success(function (data) {
        $('html, body').animate({ scrollTop: 0 }, 100);

        data = $scope.trimPageContent(data);
        
        $scope.mvn = {};
          
        // switch presentation if necessary
        $scope.resolvePagePresentation(data);
        // show new content to presenter
        $scope.pageSrc = data;
      });
    });
  })
  ;
})();


