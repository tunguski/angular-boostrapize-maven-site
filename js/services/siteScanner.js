(function() {
  angular.module('ngBootstrapizeMaven')
  .service('siteScanner', function (pageCache) {
    var scanned;

    function setupScanned() {
      scanned = { '/maven': {}, __meta: { pages: {
        all: 1,
        '200': 1,
        '404': 0,
        '403': 0
      } } };
    }
    setupScanned();

    if (localStorage && localStorage.getItem('siteScannerReport')) {
      //scanned = JSON.parse(localStorage.getItem('siteScannerReport'));
    }
    
    var siteScanner = {
      isScanning: false,
      report: scanned,
      
      clear: function () {
        localStorage.removeItem('siteScannerReport');
        setupScanned();
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
          var toScan = siteScanner.toScan = [[ '/maven/', data.processed.find('a[href^="#"]') ]];
          
          function scanNext() {
            if (!siteScanner.isScanning) {
              return;
            }
            
            while (!toScan[0][1].length && toScan.length) {
              toScan.shift();
              if (localStorage) {
                //localStorage.setItem('siteScannerReport', JSON.stringify(scanned));
              }
            }
            
            if (toScan.length) {
              var anchor = $(toScan[0][1].pop());
              var href = anchor.attr('href').replace(/#[/]+/, '/');
              
              href = '/maven/' + href;
              href = href.replace(/[/]+/g, '/');
          
              function addLinksAndScan(pageData) {
                scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                scanned[toScan[0][0]][href] = pageData;
                if (pageData.processed) {
                  toScan.push([ href, pageData.processed.find('a[href^="#"]') ]);
                }
                scanned[href] = {}
                scanned.__meta.pages.all = scanned.__meta.pages.all + 1;
                scanned.__meta.pages['200'] = scanned.__meta.pages['200'] + 1;
                scanNext();
              }

              if (scanned[href]) {
                scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                scanned[toScan[0][0]][href] = pageCache.get(href);
                scanNext();
              } else {
                var base = toScan[0][0];
                
                pageCache.load(href, addLinksAndScan, function (result) {
                  scanned[toScan[0][0]] = scanned[toScan[0][0]] || {};
                  scanned[toScan[0][0]][href] = result;
                  scanned.__meta.pages.all = scanned.__meta.pages.all + 1;
                  scanned.__meta.pages[result.status] = 
                    (scanned.__meta.pages[result.status] || 0) + 1;
                  scanNext();
                }, base.substr('/maven'.length));
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