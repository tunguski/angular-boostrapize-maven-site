(function() {
  angular.module('ngBootstrapizeMaven')
  .controller('RepositorySearchCtrl', function ($scope, $location) {
    function setSearch() {
      $scope.search = {
        a: $location.search('a'),
        g: $location.search('g'),
        v: $location.search('v')
      };
    }
    setSearch();
    
    $scope.$on('$locationChangeSuccess', function () {
      setSearch();
    });
  })
  .controller('RepositorySearchNaviCtrl', function ($scope) {
  })
  .controller('RepositorySearchContentCtrl', function ($scope) {
  })
  .controller('RepositorySearchDownloadCtrl', function ($scope) {
  })
  ;
})();

