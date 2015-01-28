(function() {
  angular.module('abms')
  .service('mvnRepository', function ($http, $timeout, $q) {
    var index
    
    var mvnRepository = {
      search: function (query) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        if (query && query.length >= 3) {
          if (mvnRepository.queryFuture) {
            $timeout.cancel(mvnRepository.queryFuture);
          }

          // delay request by half second
          mvnRepository.queryFuture = $timeout(function () {
            $http.get('/search?q=' + query + '&rows=10&wt=json')
              .success(function (data) {
                deferred.resolve(data);
              }).error(function (data) {
                deferred.reject(data);
              });
          }, 250);
        } else {
          deferred.reject('Query string too short');
        }
        
        return promise;
      }
    };
    
    return mvnRepository;
  });
})();