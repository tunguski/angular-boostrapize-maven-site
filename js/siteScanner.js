(function() {
  angular.module('ngBootstrapizeMaven')
  .service('siteScanner', function (pageCache) {
    function trimTrailingSlashes(hash) {
      while (hash.lastIndexOf('/') >= 0 && hash.lastIndexOf('/') + 1 === hash.length) {
        hash = hash.substring(0, hash.length - 1);
      }
      
      return hash;
    }
    
    var scanned = { '/maven': {} };
    if (localStorage && localStorage.getItem('siteScannerReport')) {
      scanned = JSON.parse(localStorage.getItem('siteScannerReport'));
    }
    
    var siteScanner = {
      isScanning: false,
      report: scanned,
      
      clear: function () {
        localStorage.removeItem('siteScannerReport');
         scanned = siteScanner.report = { '/maven': {} };
      },
      
      stop: function () {
        siteScanner.isScanning = false;
      },
      
      scan: function () {
        if (siteScanner.isScanning) {
          return;
        }
        siteScanner.isScanning = true;
        
        pageCache.load('/maven/', function (data) {
          var toScan = [[ '/maven/', data.processed.find('a[href^="#"]') ]];
          
          function scanNext() {
            if (!siteScanner.isScanning) {
              return;
            }
            
            if (!toScan[0][1].length) {
              toScan.shift();
              if (localStorage) {
                localStorage.setItem('siteScannerReport', JSON.stringify(scanned));
              }
            }
            
            if (toScan.length) {
              var anchor = $(toScan[0][1].pop());
              var href = anchor.attr('href').replace(/#/, 'maven');
          
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
                var hash = toScan[0][0].substr('/maven'.length);
                // if hash ends with file, skip it
                var hash = hash.replace(/\/[^./]+\..+$/g, '');
                // trim
                hash = trimTrailingSlashes(hash);
                
                pageCache.load(href, addLinksAndScan, function (result) {
                  scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                  scanned[toScan[0][0]][href] = result;
                  scanNext();
                }, hash);
              }
            } else {
              siteScanner.isScanning = false;
            }
          }
          
          scanNext();
        }, null, '/');
      }
    };
    
    return siteScanner;
  });
})();