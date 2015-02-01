(function($) {
  $.fn.changeElementType = function(newType) {
    var attrs = {};

    $.each(this[0].attributes, function(idx, attr) {
      attrs[attr.nodeName] = attr.nodeValue;
    });

    this.replaceWith(function() {
      return $("<" + newType + "/>", attrs).append($(this).contents());
    });
  };

  $.fn.pop = function() {
    var top = this.get(-1);
    this.splice(this.length-1,1);
    return top;
  };
})(jQuery);



(function() {
  angular.module('abms', ['ui.bootstrap', 'ngSanitize'])
  
  
  .run(function ($rootScope) {
    $rootScope.scopeSetter = function (field) {
      var self = this;
      return function (value) {
        self[field] = value;
      };
    };
  })
  
  
  .controller('AppCtrl', function ($scope, $http, $location, pageCache, siteScanner, config) {
    $scope.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 100);
    }
    
    
    $scope.outerHtml = function (jq) {
      return jq.map(function (index, element) {
        return angular.element(element).prop('outerHTML');
      });
    }
    
    
    $scope.executeWithSite = function (part, fn) {
      part = part ? part : 'site';
      this.$watch('mvn.' + part, function (element) {
        if (element) fn($scope.mvn, element);
      });
    }
    
    
    $scope.resolvePagePresentation = function (data) {
      if (data.indexOf('packageListFrame') >= 0) {
        // jxr or javadoc
        if (data.toUpperCase().indexOf('JXR') >= 0) {
          // jxr source code
          $scope.pagePresentation = '/views/jxr-page.html';
        } else {
          // javadocs
          $scope.pagePresentation = '/views/javadoc-page.html';
        }
      } else if (data.indexOf('Rendered using Apache Maven Fluido Skin') >= 0
                 || data.indexOf('<link rel="stylesheet", href: "./css/apache-maven-fluido-') >= 0) {
        // fluido presentation
        $scope.pagePresentation = '/views/fluido-site-page.html';
      } else if ($location.path().indexOf('/apidocs/') >= 0) {
        // silngle javadoc page reference
        $scope.pagePresentation = '/views/javadoc-page.html';
      } else {
        // default presentation
        $scope.pagePresentation = '/views/default-site-page.html';
      }
    };
    
    
    $scope.$on('$locationChangeSuccess', function (data) {
      $scope.hash = $location.path();
      $scope.page = '/' + config.base + $scope.hash;
      
      if ($scope.hash.indexOf('_') == 0 || $scope.hash.indexOf('/_') == 0) {
        $scope.pagePresentation = $scope.hash.substr($scope.hash.indexOf('_') + 1);
      } else {
        pageCache.load($scope.page, function (data) {
          $('html, body').animate({ scrollTop: 0 }, 100);

          // switch presentation if necessary - pass full source for beter detection
          $scope.resolvePagePresentation(data.src);

          data = data.trimmed;

          $scope.mvn = {};

          // show new content to presenter
          $scope.pageSrc = data;
        });
      }
    });
  })
  
  
  .controller('MenuCtrl', function ($scope, mvnRepository, $timeout) {
    $scope.$watch('query', function (query) {
      mvnRepository.search(query).then($scope.scopeSetter('searchResults'));
      $scope.showSearchResults = query && query.length >= 3;
    });
    
    $scope.hideSearchResults = function () {
      $timeout(function () {
        $scope.searchFocus = false;
      }, 100);
    };
    
    $scope.themes = [
      { name: 'Bootstrap 3.3', 
        href: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css',
        defaultHlTheme: 'xcode'
      }];
    angular.forEach([
      { name: 'Cerulean', defaultHlTheme: 'xcode' },
      { name: 'Cosmo', defaultHlTheme: 'xcode' },
      { name: 'Cyborg', defaultHlTheme: 'monokai_sublime' },
      { name: 'Darkly', defaultHlTheme: 'monokai_sublime' },
      { name: 'Flatly', defaultHlTheme: 'xcode' },
      { name: 'Journal', defaultHlTheme: 'xcode' },
      { name: 'Lumen', defaultHlTheme: 'xcode' },
      { name: 'Paper', defaultHlTheme: 'xcode' },
      { name: 'Readable', defaultHlTheme: 'xcode' },
      { name: 'Sandstone', defaultHlTheme: 'xcode' },
      { name: 'Simplex', defaultHlTheme: 'xcode' },
      { name: 'Slate', defaultHlTheme: 'monokai_sublime' },
      { name: 'Spacelab', defaultHlTheme: 'xcode' },
      { name: 'Superhero', defaultHlTheme: 'solarized_dark' },
      { name: 'United', defaultHlTheme: 'xcode' },
      { name: 'Yeti', defaultHlTheme: 'xcode' }
    ], function (element) {
      element.href = '//bootswatch.com/' + element.name.toLowerCase() + '/bootstrap.min.css';
      $scope.themes.push(element);
    });
    
    $scope.$watch('selectedTheme', function (selectedTheme) {
      if (!selectedTheme) {
        $scope.selectedTheme = selectedTheme = $scope.themes[0];
      }
      
      // set highlight theme as well
      $scope.selectedHlTheme = _.findWhere($scope.hlThemes, { style: selectedTheme.defaultHlTheme});
      
      $('link#theme-link').attr('href', selectedTheme.href);

      if (localStorage) {
        localStorage.setItem('site.theme', JSON.stringify($scope.selectedTheme));
      }
    });
    
    $scope.hlThemes = [];
    angular.forEach([
      { title: "Default", style: "default" },
      { title: "Dark", style: "dark" },
      { title: "FAR", style: "far" },
      { title: "IDEA", style: "idea" },
      { title: "Sunburst", style: "sunburst" },
      { title: "Zenburn", style: "zenburn" },
      { title: "Visual Studio", style: "vs" },
      { title: "Ascetic", style: "ascetic" },
      { title: "Magula", style: "magula" },
      { title: "GitHub", style: "github" },
      { title: "Google Code", style: "googlecode" },
      { title: "Brown Paper", style: "brown_paper" },
      { title: "School Book", style: "school_book" },
      { title: "IR Black", style: "ir_black" },
      { title: "Solarized - Dark", style: "solarized_dark" },
      { title: "Solarized - Light", style: "solarized_light" },
      { title: "Arta", style: "arta" },
      { title: "Monokai", style: "monokai" },
      { title: "Monokai Sublime", style: "monokai_sublime" },
      { title: "XCode", style: "xcode" },
      { title: "Pojoaque", style: "pojoaque" },
      { title: "Rainbow", style: "rainbow" },
      { title: "Tomorrow", style: "tomorrow" },
      { title: "Tomorrow Night", style: "tomorrow-night" },
      { title: "Tomorrow Night Bright", style: "tomorrow-night-bright" },
      { title: "Tomorrow Night Blue", style: "tomorrow-night-blue" },
      { title: "Tomorrow Night Eighties", style: "tomorrow-night-eighties" },
      { title: "Railscasts", style: "railscasts" },
      { title: "Obsidian", style: "obsidian" },
      { title: "Docco", style: "docco" },
      { title: "Mono Blue", style: "mono-blue" },
      { title: "Foundation", style: "foundation" },
      { title: "Atelier Dun - Dark", style: "atelier-dune.dark" },
      { title: "Atelier Dun - Light", style: "atelier-dune.light" },
      { title: "Atelier Forest - Dark", style: "atelier-forest.dark" },
      { title: "Atelier Forest - Light", style: "atelier-forest.light" },
      { title: "Atelier Heath - Dark", style: "atelier-heath.dark" },
      { title: "Atelier Heath - Light", style: "atelier-heath.light" },
      { title: "Atelier Lakeside - Dark", style: "atelier-lakeside.dark" },
      { title: "Atelier Lakeside - Light", style: "atelier-lakeside.light" },
      { title: "Atelier Seaside - Dark", style: "atelier-seaside.dark" },
      { title: "Atelier Seaside - Light", style: "atelier-seaside.light" },
      { title: "Paraíso - Dark", style: "paraiso.dark" },
      { title: "Paraíso - Light", style: "paraiso.light" },
      { title: "Colorbrewer", style: "color-brewer" },
      { title: "Codepen.io Embed", style: "codepen-embed" },
      { title: "Kimbie - Dark", style: "kimbie.dark" },
      { title: "Kimbie - Light", style: "kimbie.light" },
      { title: "Hybrid", style: "hybrid" },
      { title: "Darkula", style: "darkula" }
    ], function (element) {
      element.href = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/' + element.style + '.min.css';
      element.name = element.title;
      $scope.hlThemes.push(element);
    });
    
    $scope.$watch('selectedHlTheme', function (selectedHlTheme) {
      if (!selectedHlTheme) {
        $scope.selectedHlTheme = selectedHlTheme = $scope.hlThemes[0];
      }
      
      $('link#hl-theme-link').attr('href', selectedHlTheme.href);

      if (localStorage) {
        localStorage.setItem('site.hlTheme', JSON.stringify($scope.selectedHlTheme));
      }
    });
    
    
    if (localStorage && localStorage.getItem('site.theme')) {
      $scope.selectedTheme = JSON.parse(localStorage.getItem('site.theme'));
      $scope.selectedHlTheme = JSON.parse(localStorage.getItem('site.hlTheme'));
    }
  })
  
  
  .controller('FooterCtrl', function ($scope) {
    $scope.executeWithSite('footerContent', function (mvn) {
      $scope.footerHtml = angular.element($scope.mvn.footerContent).prop('outerHTML');
    });
  })
  
  
  .directive('dynamicElement', function ($compile) {
    return { 
      restrict: 'E', 
      replace: true,
      link: function(scope, element, attrs) {
        scope.$watch(attrs.message, function (content) {
        var template = $compile(content)(scope);
        element.replaceWith(template);               
        });
      }
    };
  })
  ;
})();


