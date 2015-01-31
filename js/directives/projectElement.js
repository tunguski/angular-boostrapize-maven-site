angular.module('abms')
  .directive('projectElement', function factory($compile) {
    return {
      restrict: 'EA',
      transclude: true,
      scope: {
        element: '=projectElement'
      },
      template: '<div class="project-element">' +
                    '<a ng-bind="elementName"></a>' +
                    '<a ng-if="innerElements && elementName" ng-click="toggleCollapse()" class="pull-right"><span class="caret"></span></a>' +
                    '<ul ng-if="innerElements" collapse="collapsed">' +
                        '<li ng-repeat="element in innerElements" project-element="element"></li>' +
                    '</ul>' +
                  '</div>',
      
      compile: function(tElement, tAttr, transclude) {
        var contents = tElement.contents().remove();
        var compiledContents;
        return function(scope, iElement, iAttr) {
          scope.toggleCollapse = function () {
            scope.collapsed = !scope.collapsed;
          }
          
          scope.innerElements = undefined;

          scope.$watch('element', function (element) {
            scope.elementName = element.name;
            scope.innerElements = element.elements;

            var lookup = element;
            while (lookup.elements && lookup.elements.length === 1) {
              lookup = lookup.elements[0];
              scope.elementName = scope.elementName + '.' + lookup.name;
              scope.innerElements = lookup.elements;
            }
          });

          if(!compiledContents) {
            compiledContents = $compile(contents, transclude);
          }
          compiledContents(scope, function(clone, scope) {
            iElement.append(clone); 
          });
        };
      }
    };
  })
;
