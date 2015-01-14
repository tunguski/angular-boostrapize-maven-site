(function() {
  angular.module('ngBootstrapizeMaven')
  .service('mvnLinker', function ($rootScope, $location) {
    function trimTrailingSlashes(hash) {
      while (hash.lastIndexOf('/') >= 0 && hash.lastIndexOf('/') + 1 === hash.length) {
        hash = hash.substring(0, hash.length - 1);
      }
      
      return hash;
    }
    
    var mvnLinker = {
      linkRelativeTo: function (hash) {
        return function (match) {
          // for external links return what was matched
          if (match.match(/http[s]?:\/\/maven.apache.org/)) {
            match = match.replace(/http[s]?:\/\/maven.apache.org/, '');
          } else if (match.indexOf('href="http') == 0) {
            return match;
          }

          var i = 0;
          while (true) {
            i = i + 1;
            if (i > 100) {
              throw Error('infinite loop');
            }

            if (match.indexOf('href="/') === 0) {
              // do not modify absolute paths
              break;
            } else if (match.indexOf('href="../') >= 0) {
              // it's not perfect as '....//' will generate two folds, but I assume page hrefs are safe
              match = match.replace(/\.\.\//, '');
              hash = trimTrailingSlashes(hash.substr(0, hash.lastIndexOf('/')));
            } else if (match.indexOf('href="./') >= 0) {
              // it's not perfect as '....//' will generate two folds, but I assume page hrefs are safe
              match = match.replace(/\.\//, '');
            } else {
              break;
            }
          }

          // add hash to href
          return 'href="#' + (hash && !(match.indexOf('href="/') === 0) 
                              ? hash + '/' : '' ) + match.substr(6);
        }
      },
      
      link: function () {
        var hash = $location.path();
        // if hash ends with file, skip it
        var hash = hash.replace(/\/[^./]+\..+$/g, '');
        // trim
        hash = trimTrailingSlashes(hash);

        return mvnLinker.linkRelativeTo(hash);
      }
    };
    
    return mvnLinker;
  });
})();