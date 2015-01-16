(function() {
  angular.module('ngBootstrapizeMaven')
  .service('mvnLinker', function ($rootScope, $location) {
    function trimFileAndTrailingSlashes(hash) {
      // if hash ends with file, skip it
      hash = hash.replace(/(^|\/)[^./]+\.[^/]+$/, '');

      // remove all ending slashes
      while (hash.lastIndexOf('/') >= 0 && hash.lastIndexOf('/') + 1 === hash.length) {
        hash = hash.substring(0, hash.length - 1);
      }
      
      return hash || '/';
    }
    
    var mvnLinker = {
      linkRelativeTo: function (hash) {
        hash = trimFileAndTrailingSlashes(hash);
        
        return function (match) {
          var localHash = hash;
          // for external links return what was matched
          if (match.match(/http[s]?:\/\/maven.apache.org/)) {
            match = match.replace(/http[s]?:\/\/maven.apache.org/, '');
          } else if (match.indexOf('href="http') == 0
                  || match.indexOf('href="mailto:') == 0) {
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
              localHash = trimFileAndTrailingSlashes(localHash.substr(0, localHash.lastIndexOf('/')));
            } else if (match.indexOf('href="./') >= 0) {
              // it's not perfect as '....//' will generate two folds, but I assume page hrefs are safe
              match = match.replace(/\.[\/]+/, '');
            } else {
              break;
            }
          }

          // add hash to href
          var newHref = 'href="#' + (localHash && !(match.indexOf('href="/') === 0) 
                              ? localHash + '/' : '' ) + match.substr('/maven'.length);
          newHref = newHref.replace(/\/\//g, '/').replace(/:\//g, '://');
          return newHref;
        }
      },
      
      link: function () {
        return mvnLinker.linkRelativeTo(trimTrailingSlashes($location.path()));
      }
    };
    
    return mvnLinker;
  });
})();