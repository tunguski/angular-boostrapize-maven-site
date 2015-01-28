(function() {
  angular.module('abms')
  
  
  .controller('JavaDocCtrl', function ($scope, framedViewService) {
    framedViewService.baseConfiguration($scope);
  })
  
  
  .controller('JavaDocOverviewCtrl', function ($scope) {
  })
  
  
  .controller('JavaDocAllClassesCtrl', function ($scope) {
    $scope.executeWithSite('packageFrame', function (mvn, frame) {
      mvn.allClasses = frame.find('li a');
      $scope.elements = $scope.outerHtml(mvn.allClasses);
    });
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

