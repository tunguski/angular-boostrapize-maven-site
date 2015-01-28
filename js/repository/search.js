(function() {
  angular.module('abms')
  
  
  .controller('RepositorySearchCtrl', function ($scope, $location) {
    function setSearch() {
      $scope.search = $location.search();
    }
    setSearch();
    
    $scope.$on('$locationChangeSuccess', function () {
      setSearch();
    });
  })
  
  
  .controller('RepositorySearchNaviCtrl', function ($scope) {
  })
  
  
  .controller('RepositorySearchContentCtrl', function ($scope, mvnRepository) {
    function setSearchQuery() {
      $scope.query = '';
      if ($scope.search.a) {
        $scope.query = $scope.query + 'a:"' + $scope.search.a + '"';
      }
      if ($scope.search.g) {
        $scope.query =  $scope.query + 
          ($scope.query.length > 0 ? ' AND ' : '') + 'g:"' + $scope.search.g + '" ';
      }
      if ($scope.search.v) {
        $scope.query = $scope.query + 
          ($scope.query.length > 0 ? ' AND ' : '') + 'v:"' + $scope.search.v + '" ';
      }
    }
    setSearchQuery();
    
    $scope.$on('$locationChangeSuccess', function () {
      setSearchQuery();
    });
    
    
    $scope.$watch('query', function (query) {
      mvnRepository.search(query).then($scope.scopeSetter('searchResults'));
    });
  })
  
  
  .controller('RepositorySearchDownloadCtrl', function ($scope) {
  })
  ;
})();

