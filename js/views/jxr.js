(function() {
  angular.module('abms')
  
  
  .controller('JxrCtrl', function ($scope, framedViewService) {
    framedViewService.baseConfiguration($scope);
  })
  
  
  .controller('JxrOverviewCtrl', function ($scope) {
  })
  
  
  .controller('JxrAllClassesCtrl', function ($scope) {
  })
  
  
  .controller('JxrSummaryCtrl', function ($scope) {
    $scope.click = function () {
      alert('test!');
    }
    
    $scope.executeWithSite('classFrame', function (mvn, frame) {
      $scope.summary = [];

      if (frame.find('.framenoframe').length) {
        var firstChild = $(frame.find('.framenoframe')[0]).next();
        while (firstChild.length && !firstChild.hasClass('framenoframe') && !firstChild.hasClass('overview')) {
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

