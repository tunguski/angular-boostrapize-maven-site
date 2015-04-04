(function() {
  angular.module('abms')
  
  
  .controller('JavaDocCtrl', function ($scope, $rootScope, framedViewService) {
    framedViewService.baseConfiguration($scope);
    
    $rootScope.fullWindow = true;
    
    $scope.$on("$destroy", function() {
      $rootScope.fullWindow = false;
    });
  })
  
  
  .controller('JavaDocOverviewCtrl', function ($scope) {
  })
  
  
  .controller('JavaDocAllClassesCtrl', function ($scope) {
  })
  
  
  .controller('JavaDocSummaryCtrl', function ($scope) {
    $scope.click = function () {
      alert('test!');
    }
    
    $scope.executeWithSite('classFrame', function (mvn, frame) {
      $scope.summary = [];
      
      frame.find('script, .topNav, .bottomNav, .subNav').remove();
      frame.find('ol, ul').addClass('list-unstyled');

      if (frame.find('.framenoframe').length) {
        var firstChild = $(frame.find('.framenoframe')[0]).next();
        while (firstChild.length 
               && !firstChild.hasClass('framenoframe') 
               && !firstChild.hasClass('overview')) {
          $scope.summary.push(firstChild.prop('outerHTML'));
          firstChild = firstChild.next();
        }
      } else {
        $scope.summary.push(frame.prop('outerHTML'));
      }
    });
  })
  ;
})();

