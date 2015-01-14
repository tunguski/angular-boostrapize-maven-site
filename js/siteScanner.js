(function() {
  angular.module('ngBootstrapizeMaven')
  .service('siteScanner', function (pageCache) {
    var isScanning = false;
    
    var siteScanner = {
      report: {},
      scan: function () {
        if (isScanning) {
          return;
        }
        isScanning = true;
        
        var scanned = siteScanner.report = { '/maven': {} };
        
        pageCache.load('/maven', function (data) {
          var toScan = [[ '/maven', data.processed.find('a[href^="#"]') ]];
          
          function scanNext() {
            if (!toScan[0][1].length) {
              toScan.shift();
            }
            
            if (toScan.length) {
              var anchor = $(toScan[0][1].pop());
              var href = anchor.attr('href').replace(/#/, 'maven/');
          
              function addLinksAndScan(pageData) {
                scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                scanned[toScan[0][0]][href] = pageData;
                if (pageData.processed) {
                  toScan.push([ href, pageData.processed.find('a[href^="#"]') ]);
                }
                scanned[href] = {}
                scanNext();
              }

              if (scanned[href]) {
                scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                scanned[toScan[0][0]][href] = pageCache.get(href);
                scanNext();
              } else {
                pageCache.load(href, addLinksAndScan, function (result) {
                  scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                  scanned[toScan[0][0]][href] = result;
                  scanNext();
                });
              }
            } else {
              isScanning = false;
            }
          }
          
          scanNext();
        });
      }
    };
    
    return siteScanner;
  });
})();