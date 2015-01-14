(function() {
  angular.module('ngBootstrapizeMaven')
  .service('menuMemory', function () {
    var memory = {};
    
    var menuMemory = {
      clicked: function (text) {
        memory[text] = !memory[text];
      },
      
      isOpen: function (text) {
        return !!memory[text];
      }
    };
    
    return menuMemory;
  });
})();