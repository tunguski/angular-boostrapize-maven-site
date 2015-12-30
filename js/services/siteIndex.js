(function() {
  angular.module('abms')
  .service('siteIndex', function ($firebaseObject) {
    var db = new Firebase("https://abms.firebaseio.com");
    var index = {};
    var idx = $firebaseObject(db.child("index"));
    idx.$loaded().then(function () {
      index = lunr.Index.load(JSON.parse(idx.$value));
    });
    
    var siteIndex = {
      
      hashCode: function(text) {
        var hash = 0, i, chr, len;
        if (text.length === 0) return hash;
        for (i = 0, len = text.length; i < len; i++) {
          chr   = text.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      },
      
      // save page's text in database
      savePage: function (url, data) {
        // remove . # $ / [ ]
        var key = 'page_' + url.replace(/[.#$/\[\]]/g, '_');
        var hash = siteIndex.hashCode(data);
        
        var oldHash = $firebaseObject(db.child("textPages").child(key).child('hash'));
        oldHash.$loaded().then(function () {
          // update page data in db only when hash changed
          if (hash !== oldHash.$value) {
            var page = $firebaseObject(db.child("textPages").child(key));
            page.url = url;
            page.data = data;
            page.hash = hash;
            page.timestamp = new Date().getTime();
            page.date = new Date().toString();
            page.$save();

            //siteIndex.updateIndex();
          }
        });
      },
      
      // create new site index and save in database
      updateIndex: function () {
        var textPages = $firebaseObject(db.child("textPages"));
        
        var newIndex = lunr(function () {
          this.field('data');
          this.ref('url');
        });
        
        textPages.$loaded().then(function () {
          angular.forEach(textPages, function (elem) {
            // add to index
            newIndex.add(elem);
          });
        
          // save new index
          db.child("index").set(JSON.stringify(newIndex.toJSON()));
        });
      },
      
      // search for text in site's index
      search: function (query) {
        
      }
    };
    
    return siteIndex;
  })
  ;
})();
           
