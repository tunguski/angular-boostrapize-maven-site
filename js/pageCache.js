(function() {
  angular.module('ngBootstrapizeMaven')
  .service('pageCache', function ($http, mvnLinker) {
    var memory = {};
    
    var pageCache = {
      get: function (path) {
        return memory[path];
      },
      
      trimPageContent: function (data) {
        if (data.indexOf('<frameset') >= 0) {
          // get only body content, as jquery cannot parse full page
          data = data.substring(data.indexOf('<frameset'), data.lastIndexOf('</frameset>'));
        } else {
          // get only body content, as jquery cannot parse full page
          data = data.substring(data.indexOf('<body'), data.lastIndexOf('</body>'));
        }

        // very shitty - remove 'non-breaking space styling'
        data = data.replace(/(&nbsp;|&#160;)/g, '');

        return '<div>' + data.substr(data.indexOf('>') + 1) + '</div>';
      },
      
      load: function (path, successFn, failureFn, relativeTo) {
        path = path.replace(/\/\//g, '/').replace(/:\//g, '://').replace(/^\/?#/, '/maven');
        
        if (pageCache.get(path)) {
          successFn(pageCache.get(path));
        } else {
          var relative = path.indexOf('maven/') >= 0 ?
            path.substr(path.indexOf('maven/') + 5) : path.substr('maven/'.length);
          
          $http.get(path).success(function (pageSrc, status, headers, config) {
            // FIXME: stopping images from loading - but images in content should be loaded!
            pageSrc = pageSrc.replace(/<img /g, '<i ').replace(/<\/img>/g, '</i>');
            // rewrite links so they work in ang-boot-mav-site
            pageSrc = pageSrc.replace(/href=".*?"/g,  mvnLinker.linkRelativeTo(relative));

            var pageData =  memory[path] = { src: pageSrc };
            pageData.status = status;
            pageData.loadTime = new Date().toString();
            pageData.trimmed = pageCache.trimPageContent(pageSrc);
            pageData.processed = $(pageData.trimmed);

            successFn(pageCache.get(path));
          }).error(function (data, status, headers, config) {
            memory[path] = { data: data, status: status };
            
            if (failureFn) {
              failureFn(memory[path]);
            }
          });
        }
      }
    };
    
    return pageCache;
  });
})();