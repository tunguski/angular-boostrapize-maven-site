(function() {
  angular.module('abms')
  .service('mvnLinker', function ($rootScope, $location, config) {
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
      linkRelativeTo: function (rawHash) {
        var hash = trimFileAndTrailingSlashes(rawHash);
        
        return function (match) {
          var localHash = hash;
          // for external links return what was matched
          if (match.match(new RegExp('http[s]?:\/\/' + config.site))) {
            match = match.replace(new RegExp('http[s]?:\/\/' + config.site), '');
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
          if (match.indexOf('#') < 0) {
            var newHref = 'href="#' + (localHash && !(match.indexOf('href="/') === 0) 
                                ? localHash + '/' : '' ) + match.substr(config.base.length);
          } else {
            var newHref = 'href="#' + rawHash + match.substr(config.base.length);
          }
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